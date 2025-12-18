import { query } from '../libs/db.js';

/**
 * Tính toán và cập nhật phí trễ hạn cho các kỳ thanh toán quá hạn
 * Được gọi tự động khi:
 * - User đăng nhập / mở app
 * - Gọi API lấy chi tiết installment
 * - Trước khi thanh toán kỳ
 * 
 * ✨ TỰ ĐỘNG CỘNG PHÍ VÀO KỲ CUỐI
 * 
 * @param {number} installmentId - ID hợp đồng cần tính phí (optional, nếu không truyền sẽ tính cho tất cả)
 * @returns {Promise<Object>} Kết quả tính toán
 */
export async function calculateAndUpdateOverdueFees(installmentId = null) {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // các kỳ thanh toán quá hạn (unpaid và due_date < today) 
        let queryStr = `
            SELECT 
                ip.payment_id,
                ip.installment_id,
                ip.payment_no,
                ip.amount,
                ip.due_date,
                ip.status,
                ip.overdue_days as current_overdue_days,
                ip.overdue_fee as current_overdue_fee,
                i.overdue_fee_percent_per_day,
                i.num_terms,
                DATEDIFF(CURDATE(), ip.due_date) as calculated_overdue_days
            FROM installment_payments ip
            INNER JOIN installments i ON ip.installment_id = i.installment_id
            WHERE ip.paid_date IS NULL 
            AND ip.due_date < CURDATE()
            AND i.status IN ('active', 'approved')
        `;

        const params = [];
        
        if (installmentId) {
            queryStr += ' AND ip.installment_id = ?';
            params.push(installmentId);
        }

        queryStr += ' ORDER BY ip.installment_id, ip.payment_no';

        const overduePayments = await query(queryStr, params);

        if (overduePayments.length === 0) {
            return {
                success: true,
                processed: 0,
                message: 'Không có kỳ thanh toán quá hạn'
            };
        }

        let updatedCount = 0;
        const installmentTotalFees = {}; // Track total fees by installment_id
        const installmentMaxTerms = {}; // Track max payment_no by installment_id

        // Tính toán và cập nhật từng kỳ
        for (const payment of overduePayments) {
            const overdueDays = payment.calculated_overdue_days;
            
            if (overdueDays <= 0) continue;

            const overdueRate = payment.overdue_fee_percent_per_day || 0;
            
            // Công thức: overdue_fee = amount * (overdue_rate / 100) * overdue_days
            const calculatedFee = payment.amount * (overdueRate / 100) * overdueDays;
            const roundedFee = Math.round(calculatedFee * 100) / 100;

            // Chỉ cập nhật nếu có thay đổi (tránh update không cần thiết)
            const needsUpdate = 
                payment.status !== 'overdue' ||
                payment.current_overdue_days !== overdueDays ||
                Math.abs((payment.current_overdue_fee || 0) - roundedFee) > 0.01;

            if (needsUpdate) {
                await query(
                    `UPDATE installment_payments 
                    SET status = 'overdue',
                        overdue_days = ?,
                        overdue_fee = ?
                    WHERE payment_id = ?`,
                    [overdueDays, roundedFee, payment.payment_id]
                );

                updatedCount++;
            }

            // Track total fee và max terms cho từng installment
            if (!installmentTotalFees[payment.installment_id]) {
                installmentTotalFees[payment.installment_id] = 0;
                installmentMaxTerms[payment.installment_id] = payment.num_terms;
            }
            installmentTotalFees[payment.installment_id] += roundedFee;
        }

        // Cập nhật total_overdue_fee và tự động cộng vào kỳ cuối
        for (const [instId, totalFee] of Object.entries(installmentTotalFees)) {
            
            // ✨ TÍNH TỔNG PHÍ BAO GỒM CẢ CÁC KỲ ĐÃ THANH TOÁN (nhưng có phí trễ)
            const allFeesResult = await query(
                `SELECT COALESCE(SUM(overdue_fee), 0) as total_all_fees
                FROM installment_payments
                WHERE installment_id = ? 
                AND overdue_fee > 0`,
                [instId]
            );
            
            const totalAllFees = parseFloat(allFeesResult[0].total_all_fees || 0);
            
            console.log(`[OverdueCalculator] 📊 Installment #${instId}: Phí kỳ chưa thanh toán: ${totalFee}, Tổng tất cả phí: ${totalAllFees}`);
            
            // Cập nhật total_overdue_fee (bao gồm cả phí của kỳ đã thanh toán)
            await query(
                `UPDATE installments 
                SET total_overdue_fee = ?
                WHERE installment_id = ?`,
                [totalAllFees, instId]
            );

            // ✨ TỰ ĐỘNG CỘNG TỔNG PHÍ VÀO KỲ CUỐI
            const maxPaymentNo = installmentMaxTerms[instId];
            
            // Lấy thông tin kỳ cuối (chỉ kỳ chưa thanh toán)
            const lastPayments = await query(
                `SELECT payment_id, amount, note, paid_date 
                FROM installment_payments 
                WHERE installment_id = ? 
                AND payment_no = ?
                LIMIT 1`,
                [instId, maxPaymentNo]
            );

            if (lastPayments.length > 0) {
                const lastPayment = lastPayments[0];
                
                // Chỉ cộng phí vào kỳ cuối nếu kỳ cuối chưa thanh toán
                if (!lastPayment.paid_date && totalAllFees > 0) {
                    try {
                        // Lấy số tiền gốc của kỳ cuối (loại bỏ phí đã cộng trước đó nếu có)
                        let originalAmount = parseFloat(lastPayment.amount);
                        
                        // Nếu đã có phí trong note, trừ ra để lấy số tiền gốc
                        const feeMatch = lastPayment.note ? lastPayment.note.match(/Phí trễ hạn: ([0-9.]+)/) : null;
                        if (feeMatch) {
                            const previousFee = parseFloat(feeMatch[1]);
                            originalAmount = originalAmount - previousFee;
                        }
                        
                        // Tính số tiền mới = gốc + tổng phí hiện tại (bao gồm cả phí của kỳ đã thanh toán)
                        const newAmount = originalAmount + totalAllFees;
                        const newNote = `Kỳ ${maxPaymentNo} | Phí trễ hạn: ${totalAllFees.toFixed(2)} VNĐ`;
                        
                        await query(
                            `UPDATE installment_payments 
                            SET amount = ?,
                                note = ?
                            WHERE payment_id = ? AND paid_date IS NULL`,
                            [newAmount, newNote, lastPayment.payment_id]
                        );

                        console.log(`[OverdueCalculator] ✅ Tự động cộng tổng phí ${totalAllFees.toFixed(2)} vào kỳ cuối (installment #${instId}, payment #${lastPayment.payment_id})`);
                    } catch (updateError) {
                        console.error(`[OverdueCalculator] ⚠️ Lỗi cập nhật phí vào kỳ cuối (có thể đã thanh toán):`, updateError.message);
                        // Bỏ qua lỗi, không làm gián đoạn flow
                    }
                } else if (lastPayment.paid_date) {
                    console.log(`[OverdueCalculator] ℹ️ Kỳ cuối đã thanh toán, không cộng phí (installment #${instId})`);
                }
            }
        }

        return {
            success: true,
            processed: updatedCount,
            installmentsAffected: Object.keys(installmentTotalFees).length,
            message: `Đã cập nhật ${updatedCount} kỳ thanh toán quá hạn và tự động cộng phí vào kỳ cuối`
        };

    } catch (error) {
        console.error('[OverdueCalculator] Lỗi tính phí trễ hạn:', error);
        throw error;
    }
}

/**
 * Tính phí trễ hạn cho một kỳ thanh toán cụ thể (trước khi thanh toán)
 * @param {number} paymentId - ID kỳ thanh toán
 * @returns {Promise<Object>} Thông tin phí trễ hạn
 */
export async function calculatePaymentOverdueFee(paymentId) {
    try {
        const payments = await query(
            `SELECT 
                ip.payment_id,
                ip.installment_id,
                ip.payment_no,
                ip.amount,
                ip.due_date,
                ip.paid_date,
                ip.status,
                i.overdue_fee_percent_per_day,
                DATEDIFF(CURDATE(), ip.due_date) as overdue_days
            FROM installment_payments ip
            INNER JOIN installments i ON ip.installment_id = i.installment_id
            WHERE ip.payment_id = ?`,
            [paymentId]
        );

        if (payments.length === 0) {
            throw new Error('Không tìm thấy kỳ thanh toán');
        }

        const payment = payments[0];

        // Nếu đã thanh toán hoặc chưa quá hạn
        if (payment.paid_date || payment.overdue_days <= 0) {
            return {
                paymentId: payment.payment_id,
                overdueDays: 0,
                overdueFee: 0,
                isOverdue: false
            };
        }

        // Tính phí trễ
        const overdueRate = payment.overdue_fee_percent_per_day || 0;
        const calculatedFee = payment.amount * (overdueRate / 100) * payment.overdue_days;
        const roundedFee = Math.round(calculatedFee * 100) / 100;

        // Cập nhật vào DB (chỉ nếu chưa thanh toán)
        await query(
            `UPDATE installment_payments 
            SET status = 'overdue',
                overdue_days = ?,
                overdue_fee = ?
            WHERE payment_id = ? AND paid_date IS NULL`,
            [payment.overdue_days, roundedFee, paymentId]
        );

        return {
            paymentId: payment.payment_id,
            amount: payment.amount,
            dueDate: payment.due_date,
            overdueDays: payment.overdue_days,
            overdueFee: roundedFee,
            overdueRate: overdueRate,
            isOverdue: true,
            totalToPay: payment.amount + roundedFee
        };

    } catch (error) {
        console.error('[OverdueCalculator] Lỗi tính phí cho kỳ thanh toán:', error);
        throw error;
    }
}

/**
 * Cộng tổng phí trễ hạn vào kỳ thanh toán cuối cùng
 * @param {number} installmentId - ID hợp đồng
 * @returns {Promise<Object>} Kết quả
 */
export async function addOverdueFeeToLastPayment(installmentId) {
    try {
        // Lấy total_overdue_fee của hợp đồng
        const installments = await query(
            'SELECT total_overdue_fee FROM installments WHERE installment_id = ?',
            [installmentId]
        );

        if (installments.length === 0) {
            throw new Error('Không tìm thấy hợp đồng');
        }

        const totalOverdueFee = installments[0].total_overdue_fee || 0;

        if (totalOverdueFee <= 0) {
            return {
                success: true,
                message: 'Không có phí trễ hạn để cộng',
                feeAdded: 0
            };
        }

        // Tìm kỳ thanh toán cuối cùng
        const lastPayments = await query(
            `SELECT * FROM installment_payments 
            WHERE installment_id = ? 
            ORDER BY payment_no DESC 
            LIMIT 1`,
            [installmentId]
        );

        if (lastPayments.length === 0) {
            throw new Error('Không tìm thấy kỳ thanh toán nào');
        }

        const lastPayment = lastPayments[0];
        const newAmount = parseFloat(lastPayment.amount) + totalOverdueFee;

        // Cập nhật kỳ cuối
        await query(
            `UPDATE installment_payments 
            SET amount = ?,
                note = CONCAT(COALESCE(note, ''), ' | Phí trễ hạn: ', ?, ' VNĐ')
            WHERE payment_id = ?`,
            [newAmount, totalOverdueFee.toFixed(2), lastPayment.payment_id]
        );

        return {
            success: true,
            message: `Đã cộng ${totalOverdueFee.toFixed(2)} VNĐ vào kỳ thanh toán cuối`,
            feeAdded: totalOverdueFee,
            lastPaymentId: lastPayment.payment_id,
            newAmount: newAmount
        };

    } catch (error) {
        console.error('[OverdueCalculator] Lỗi cộng phí vào kỳ cuối:', error);
        throw error;
    }
}
