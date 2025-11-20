import Installment from '../models/Installment.js';
import InstallmentPayment from '../models/InstallmentPayment.js';
import { query } from '../libs/db.js';
class InstallmentService {
    /**
     * Tạo mới một khoản trả góp
     * @param {Object} installmentData - Dữ liệu trả góp
     * @param {number} installmentData.order_id - ID đơn hàng
     * @param {number} installmentData.user_id - ID người dùng
     * @param {number} installmentData.total_amount - Tổng số tiền
     * @param {number} installmentData.down_payment - Số tiền trả trước
     * @param {number} installmentData.num_terms - Số kỳ trả góp
     * @param {number} installmentData.interest_rate - Lãi suất (%)
     * @param {Date} installmentData.start_date - Ngày bắt đầu
     * @returns {Object} Installment và danh sách các kỳ thanh toán
     */
    async createInstallment(installmentData) {
        try {
            const {
                order_id,
                user_id,
                total_amount,
                down_payment,
                num_terms,
                interest_rate,
                start_date
            } = installmentData;

            // Tính toán số tiền còn lại sau khi trả trước
            const remainingAmount = total_amount - down_payment;

            // Tính toán số tiền phải trả hàng tháng (bao gồm lãi suất)
            const monthlyInterestRate = interest_rate / 100 / 12;
            let monthly_payment;

            if (interest_rate > 0) {
                // Công thức tính trả góp có lãi suất
                monthly_payment = (remainingAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, num_terms)) 
                    / (Math.pow(1 + monthlyInterestRate, num_terms) - 1);
            } else {
                // Không có lãi suất
                monthly_payment = remainingAmount / num_terms;
            }

            // Làm tròn đến 2 chữ số thập phân
            monthly_payment = Math.round(monthly_payment * 100) / 100;

            // Tính ngày kết thúc (start_date + num_terms months)
            const startDateObj = new Date(start_date);
            const endDateObj = new Date(startDateObj);
            endDateObj.setMonth(endDateObj.getMonth() + num_terms);

            // Tạo installment
            const installment = await Installment.create({
                order_id,
                user_id,
                total_amount,
                down_payment,
                num_terms,
                monthly_payment,
                interest_rate,
                start_date,
                end_date: endDateObj,
                status: 'pending' // pending, active, completed, cancelled
            });

            // Tạo các kỳ thanh toán
            const payments = [];
            for (let i = 1; i <= num_terms; i++) {
                const dueDate = new Date(startDateObj);
                dueDate.setMonth(dueDate.getMonth() + i);

                const payment = await InstallmentPayment.create({
                    installment_id: installment.installment_id,
                    payment_no: i,
                    due_date: dueDate,
                    paid_date: null,
                    amount: monthly_payment,
                    status: 'pending', // pending, paid, overdue
                    note: null
                });

                payments.push(payment);
            }

            return {
                installment,
                payments
            };
        } catch (error) {
            throw new Error(`SERVICE Lỗi tạo khoản trả góp: ${error.message}`);
        }
    }

    /**
     * Lấy thông tin trả góp theo ID
     * @param {number} installmentId 
     * @returns {Object} Installment với danh sách payments
     */
    async getInstallmentById(installmentId) {
        try {
            const installment = await Installment.findInstallmentById(installmentId);
            if (!installment) {
                throw new Error(' SERVICE Không tìm thấy khoản trả góp');
            }

            const payments = await InstallmentPayment.findAllPaymentsByInstallmentId(installmentId);

            return {
                ...installment,
                payments
            };
        } catch (error) {
            throw new Error(`SERVICELỗi lấy thông tin trả góp: ${error.message}`);
        }
    }

    /**
     * Lấy tất cả khoản trả góp của user
     * @param {number} userId 
     * @returns {Array} Danh sách installments với payments
     */
    async getInstallmentsByUserId(userId) {
        try {
            const installments = await Installment.findAllInstallmentsByUserId(userId);

            // Lấy payments cho từng installment
            const installmentsWithPayments = await Promise.all(
                installments.map(async (installment) => {
                    const payments = await InstallmentPayment.findAllPaymentsByInstallmentId(installment.installment_id);
                    return {
                        ...installment,
                        payments
                    };
                })
            );

            return installmentsWithPayments;
        } catch (error) {
            throw new Error(`SERVICELỗi lấy danh sách trả góp: ${error.message}`);
        }
    }

    /**
     * Thanh toán một kỳ trả góp
     * @param {number} paymentId - ID của kỳ thanh toán
     * @param {Object} paymentData - Dữ liệu thanh toán
     * @returns {Object} Payment đã cập nhật
     */
    async makePayment(paymentId, paymentData = {}) {
        try {
            const payment = await InstallmentPayment.findPaymentById(paymentId);
            if (!payment) {
                throw new Error('SERVICE Không tìm thấy kỳ thanh toán');
            }

            if (payment.status === 'paid') {
                throw new Error('SERVICE Kỳ thanh toán này đã được thanh toán');
            }

            // Cập nhật trạng thái thanh toán
            const updated = await InstallmentPayment.update(paymentId, {
                paid_date: paymentData.paid_date || new Date(),
                status: 'paid',
                note: paymentData.note || payment.note
            });

            if (!updated) {
                throw new Error('SERVICE Không thể cập nhật thanh toán');
            }

            // Kiểm tra xem tất cả các kỳ đã thanh toán chưa
            const installment = await Installment.findInstallmentById(payment.installment_id);
            const allPayments = await InstallmentPayment.findAllPaymentsByInstallmentId(payment.installment_id);
            
            const allPaid = allPayments.every(p => p.status === 'paid');
            
            if (allPaid) {
                // Cập nhật trạng thái installment thành completed
                await Installment.update(payment.installment_id, {
                    ...installment,
                    status: 'completed'
                });
            } else if (installment.status === 'pending') {
                // Nếu có ít nhất 1 payment được thanh toán, chuyển sang active
                await Installment.update(payment.installment_id, {
                    ...installment,
                    status: 'active'
                });
            }

            return await InstallmentPayment.findPaymentById(paymentId);
        } catch (error) {
            throw new Error(`SERVICE Lỗi thanh toán: ${error.message}`);
        }
    }

    /**
     * Kiểm tra và cập nhật các khoản thanh toán quá hạn
     * @param {number} installmentId 
     * @returns {Array} Danh sách các payment quá hạn
     */
    async checkOverduePayments(installmentId) {
        try {
            const payments = await InstallmentPayment.findAllPaymentsByInstallmentId(installmentId);
            const today = new Date();
            const overduePayments = [];

            for (const payment of payments) {
                if (payment.status === 'pending' && new Date(payment.due_date) < today) {
                    // Cập nhật trạng thái thành overdue
                    await InstallmentPayment.update(payment.payment_id, {
                        ...payment,
                        status: 'overdue'
                    });
                    overduePayments.push(payment);
                }
            }

            return overduePayments;
        } catch (error) {
            throw new Error(`SERVICE Lỗi kiểm tra thanh toán quá hạn: ${error.message}`);
        }
    }

    /**
     * Hủy khoản trả góp
     * @param {number} installmentId 
     * @returns {boolean}
     */
    async cancelInstallment(installmentId) {
        try {
            const installment = await Installment.findInstallmentById(installmentId);
            if (!installment) {
                throw new Error('SERVICE Không tìm thấy khoản trả góp');
            }

            if (installment.status === 'completed') {
                throw new Error('SERVICEKhông thể hủy khoản trả góp đã hoàn thành');
            }

            // Cập nhật trạng thái thành cancelled
            const updated = await Installment.update(installmentId, {
                ...installment,
                status: 'cancelled'
            });

            return updated;
        } catch (error) {
            throw new Error(`SERVICELỗi hủy trả góp: ${error.message}`);
        }
    }

    /**
     * Tính toán tổng số tiền đã trả
     * @param {number} installmentId 
     * @returns {Object} Thông tin tổng hợp
     */
    async getPaymentSummary(installmentId) {
        try {
            const installment = await Installment.findInstallmentById(installmentId);
            if (!installment) {
                throw new Error('SERVICEKhông tìm thấy khoản trả góp');
            }

            const payments = await InstallmentPayment.findAllPaymentsByInstallmentId(installmentId);

            const paidPayments = payments.filter(p => p.status === 'paid');
            const pendingPayments = payments.filter(p => p.status === 'pending');
            const overduePayments = payments.filter(p => p.status === 'overdue');

            const totalPaid = paidPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0) + parseFloat(installment.down_payment);
            const totalRemaining = parseFloat(installment.total_amount) - totalPaid;
            const completionPercentage = (totalPaid / parseFloat(installment.total_amount)) * 100;

            return {
                installment_id: installmentId,
                total_amount: parseFloat(installment.total_amount),
                down_payment: parseFloat(installment.down_payment),
                total_paid: totalPaid,
                total_remaining: totalRemaining,
                completion_percentage: Math.round(completionPercentage * 100) / 100,
                total_payments: payments.length,
                paid_count: paidPayments.length,
                pending_count: pendingPayments.length,
                overdue_count: overduePayments.length,
                status: installment.status,
                next_payment: pendingPayments[0] || null
            };
        } catch (error) {
            throw new Error(`SERVICELỗi tính toán tổng hợp thanh toán: ${error.message}`);
        }
    }

    /**
     * Cập nhật thông tin khoản trả góp
     * @param {number} installmentId 
     * @param {Object} updateData 
     * @returns {Object} Installment đã cập nhật
     */
    async updateInstallment(installmentId, updateData) {
        try {
            const installment = await Installment.findInstallmentById(installmentId);
            if (!installment) {
                throw new Error('SERVICE Không tìm thấy khoản trả góp');
            }

            const updated = await Installment.update(installmentId, {
                ...installment,
                ...updateData
            });

            if (!updated) {
                throw new Error('SERVICE Không thể cập nhật khoản trả góp');
            }

            return await Installment.findInstallmentById(installmentId);
        } catch (error) {
            throw new Error(`SERVICE Lỗi cập nhật trả góp: ${error.message}`);
        }
    }

    /**
     * Xóa khoản trả góp (chỉ nếu chưa có payment nào được thanh toán)
     * @param {number} installmentId 
     * @returns {boolean}
     */
    async deleteInstallment(installmentId) {
        try {
            const payments = await InstallmentPayment.findAllPaymentsByInstallmentId(installmentId);
            const hasPaidPayments = payments.some(p => p.status === 'paid');

            if (hasPaidPayments) {
                throw new Error('SERVICE Không thể xóa khoản trả góp đã có thanh toán');
            }

            // Xóa tất cả payments
            for (const payment of payments) {
                await InstallmentPayment.delete(payment.payment_id);
            }

            // Xóa installment
            const deleted = await Installment.delete(installmentId);
            return deleted;
        } catch (error) {
            throw new Error(`SERVICE Lỗi xóa trả góp: ${error.message}`);
        }
    }

    /**
     * Lấy tất cả installments (Admin only)
     */
    async getAllInstallments() {
        try {
            const installments = await query(`
                SELECT 
                    i.*,
                    u.full_name as user_name,
                    u.email as user_email,
                    u.phone as user_phone
                FROM installments i
                LEFT JOIN orders o ON i.order_id = o.order_id
                LEFT JOIN users u ON o.user_id = u.user_id
                ORDER BY i.created_at DESC  
            `);
            console.log('SERVICE: Installments from DB:', installments);
            
            // query() đã trả về array rows trực tiếp
            return Array.isArray(installments) ? installments : [];
        } catch (error) {
            throw new Error(`Lỗi lấy danh sách trả góp: ${error.message}`);
        }
    }

    /**
     * Lấy tất cả payments quá hạn (Admin only)
     */
    async getAllOverduePayments() {
        try {
            const overduePayments = await query(`
                SELECT 
                    ip.*,
                    i.order_id,
                    i.user_id,
                    u.full_name as user_name,
                    u.email as user_email,
                    u.phone as user_phone,
                    DATEDIFF(CURDATE(), ip.due_date) as days_overdue,
                    CASE 
                        WHEN DATEDIFF(CURDATE(), ip.due_date) <= 7 THEN 'low'
                        WHEN DATEDIFF(CURDATE(), ip.due_date) <= 14 THEN 'medium'
                        WHEN DATEDIFF(CURDATE(), ip.due_date) <= 30 THEN 'high'
                        ELSE 'critical'
                    END as severity,
                    (SELECT SUM(amount) 
                     FROM installment_payments 
                     WHERE installment_id = ip.installment_id 
                     AND status = 'overdue') as total_overdue_amount,
                    (SELECT COUNT(*) 
                     FROM installment_payments 
                     WHERE installment_id = ip.installment_id 
                     AND status = 'overdue') as overdue_count
                FROM installment_payments ip
                JOIN installments i ON ip.installment_id = i.installment_id
                LEFT JOIN orders o ON i.order_id = o.order_id
                LEFT JOIN users u ON o.user_id = u.user_id
                WHERE ip.status = 'overdue'
                ORDER BY days_overdue DESC, ip.amount DESC
            `);
            return Array.isArray(overduePayments) ? overduePayments : [];
        } catch (error) {
            throw new Error(`Lỗi lấy danh sách quá hạn: ${error.message}`);
        }
    }

    /**
     * Lấy thống kê tổng quan (Admin only)
     */
    async getStatistics() {
        try {
            const queryResult = await query(`
                SELECT 
                    COUNT(DISTINCT i.installment_id) as total_contracts,
                    COUNT(DISTINCT CASE WHEN i.status = 'active' THEN i.installment_id END) as active_contracts,
                    COUNT(DISTINCT CASE WHEN i.status = 'completed' THEN i.installment_id END) as completed_contracts,
                    COUNT(DISTINCT CASE WHEN i.status = 'cancelled' THEN i.installment_id END) as cancelled_contracts,
                    COALESCE(SUM(i.total_amount), 0) as total_debt,
                    COALESCE(SUM(i.total_amount - i.remaining_amount), 0) as paid_amount,
                    COALESCE(SUM(i.remaining_amount), 0) as remaining_amount,
                    COALESCE(SUM(CASE WHEN ip.status = 'overdue' THEN ip.amount ELSE 0 END), 0) as overdue_amount,
                    COUNT(DISTINCT CASE WHEN ip.status = 'overdue' THEN ip.payment_id END) as overdue_count
                FROM installments i
                LEFT JOIN installment_payments ip ON i.installment_id = ip.installment_id
            `);

            // query() trả về array, lấy phần tử đầu tiên (single row result)
            const result = Array.isArray(queryResult) && queryResult.length > 0 ? queryResult[0] : {};
            
            result.collection_rate = result.total_debt > 0 
                ? ((result.paid_amount / result.total_debt) * 100).toFixed(1) 
                : 0;
            result.overdue_rate = result.total_debt > 0 
                ? ((result.overdue_amount / result.total_debt) * 100).toFixed(1) 
                : 0;

            return result;
        } catch (error) {
            throw new Error(`Lỗi lấy thống kê: ${error.message}`);
        }
    }
}

export default new InstallmentService();

