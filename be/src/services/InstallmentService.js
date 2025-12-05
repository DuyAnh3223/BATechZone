import Installment from '../models/Installment.js';
import InstallmentPayment from '../models/InstallmentPayment.js';
import Order from '../models/Order.js';
import { query } from '../libs/db.js';
class InstallmentService {
    /**
     * Tạo mới một khoản trả góp
     * @param {Object} installmentData 
     * @param {number} installmentData.order_id 
     * @param {number} installmentData.user_id 
     * @param {number} installmentData.total_amount 
     * @param {number} installmentData.down_payment 
     * @param {number} installmentData.num_terms 
     * @param {number} installmentData.interest_rate 
     * @param {Date} installmentData.start_date 
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

            // Calculate remaining amount after down payment
            const remainingAmount = total_amount - down_payment;

            // Calculate monthly payment amount (including interest)
            const monthlyInterestRate = interest_rate / 100 / 12;
            let monthly_payment;

            if (interest_rate > 0) {
                // Formula for installment with interest
                monthly_payment = (remainingAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, num_terms)) 
                    / (Math.pow(1 + monthlyInterestRate, num_terms) - 1);
            } else {
                // No interest
                monthly_payment = remainingAmount / num_terms;
            }

            // Round to 2 decimal places
            monthly_payment = Math.round(monthly_payment * 100) / 100;

            // Calculate end date (start_date + num_terms months)
            const startDateObj = new Date(start_date);
            const endDateObj = new Date(startDateObj);
            endDateObj.setMonth(endDateObj.getMonth() + num_terms);

            // Create installment
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
                status: 'approved' // pending, approved, active, completed, cancelled
            });

            // Create installment payments
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

            // Calculate total amount paid
            const totalPaidFromPayments = payments
                .filter(p => p.status === 'paid')
                .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
            
            // Add down payment if paid
            const downPaymentPaid = installment.down_payment_status === 'paid' 
                ? parseFloat(installment.down_payment || 0) 
                : 0;
            
            const totalPaid = totalPaidFromPayments + downPaymentPaid;
            const outstandingPrincipal = parseFloat(installment.total_amount || 0) - totalPaid;

            return {
                ...installment,
                payments,
                total_paid: totalPaid,
                outstanding_principal: Math.max(0, outstandingPrincipal)
            };
        } catch (error) {
            throw new Error(`SERVICE Lỗi lấy thông tin trả góp: ${error.message}`);
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

            // Get payments for each installment and calculate total_paid
            const installmentsWithPayments = await Promise.all(
                installments.map(async (installment) => {
                    const payments = await InstallmentPayment.findAllPaymentsByInstallmentId(installment.installment_id);
                    
                    // Calculate total amount paid
                    const totalPaidFromPayments = payments
                        .filter(p => p.status === 'paid')
                        .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
                    
                    // Add down payment if paid
                    const downPaymentPaid = installment.down_payment_status === 'paid' 
                        ? parseFloat(installment.down_payment || 0) 
                        : 0;
                    
                    const totalPaid = totalPaidFromPayments + downPaymentPaid;
                    const outstandingPrincipal = parseFloat(installment.total_amount || 0) - totalPaid;

                    return {
                        ...installment,
                        payments,
                        total_paid: totalPaid,
                        outstanding_principal: Math.max(0, outstandingPrincipal)
                    };
                })
            );

            return installmentsWithPayments;
        } catch (error) {
            throw new Error(`SERVICELỗi lấy danh sách trả góp: ${error.message}`);
        }
    }

    /**
     * Lấy thông tin trả góp theo order_id
     * @param {number} orderId 
     * @returns {Object} Installment với danh sách payments
     */
    async getInstallmentByOrderId(orderId) {
        try {
            const rows = await query(
                'SELECT * FROM installments WHERE order_id = ? LIMIT 1',
                [orderId]
            );
            
            if (rows.length === 0) {
                return null;
            }
            
            const installment = rows[0];
            const payments = await InstallmentPayment.findAllPaymentsByInstallmentId(installment.installment_id);

            // Calculate total amount paid
            const totalPaidFromPayments = payments
                .filter(p => p.status === 'paid')
                .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
            
            // Add down payment if paid
            const downPaymentPaid = installment.down_payment_status === 'paid' 
                ? parseFloat(installment.down_payment || 0) 
                : 0;
            
            const totalPaid = totalPaidFromPayments + downPaymentPaid;
            const outstandingPrincipal = parseFloat(installment.total_amount || 0) - totalPaid;

            return {
                ...installment,
                payments,
                total_paid: totalPaid,
                outstanding_principal: Math.max(0, outstandingPrincipal)
            };
        } catch (error) {
            throw new Error(`SERVICE Lỗi lấy thông tin trả góp theo order_id: ${error.message}`);
        }
    }

    /**
     * Make a down payment
     * @param {number} installmentId 
     * @param {Object} paymentData 
     * @returns {Object} Updated installment
     */
    async makeDownPayment(installmentId, paymentData = {}) {
        try {
            const installment = await Installment.findInstallmentById(installmentId);
            if (!installment) {
                throw new Error('SERVICE Không tìm thấy hợp đồng trả góp');
            }

            // Check contract status - ONLY allow payment when approved
            if (installment.status !== 'approved') {
                if (installment.status === 'pending') {
                    throw new Error('SERVICE Hợp đồng đang chờ admin duyệt, chưa thể thanh toán');
                } else if (installment.status === 'rejected' || installment.status === 'cancelled') {
                    throw new Error('SERVICE Hợp đồng đã bị từ chối hoặc hủy, không thể thanh toán');
                } else {
                    throw new Error('SERVICE Trạng thái hợp đồng không hợp lệ để thanh toán trả trước');
                }
            }

            if (installment.down_payment_status === 'paid') {
                throw new Error('SERVICE Khoản trả trước đã được thanh toán');
            }

            // Check and create payments if not exist
            const existingPayments = await InstallmentPayment.findAllPaymentsByInstallmentId(installmentId);
            if (existingPayments.length === 0) {
                console.log(`SERVICE: Installment ${installmentId} chưa có payments, đang tạo...`);
                await this.generatePayments(installmentId);
                console.log(`SERVICE: Đã tạo ${installment.num_terms} payments cho installment ${installmentId}`);
            }

            // Update down payment status
            const updated = await Installment.update(installmentId, {
                down_payment_status: 'paid',
                down_payment_date: paymentData.paid_date || new Date(),
                down_payment_note: paymentData.note || 'Thanh toán trả trước'
            });

            if (!updated) {
                throw new Error('SERVICE Không thể cập nhật thanh toán trả trước');
            }

            // Change status to active after successful down payment
            await Installment.update(installmentId, {
                status: 'active'
            });

            // Update order status to "shipping"
            try {
                const orderData = await Order.getById(installment.order_id);
                if (orderData) {
                    // Create Order instance from plain object
                    const order = new Order(orderData);
                    console.log(`SERVICE: Found order ${order.orderId} with status '${order.orderStatus}'`);
                    
                    if (order.orderStatus !== 'shipping' && order.orderStatus !== 'delivered') {
                        await order.updateStatus('shipping');
                        console.log(`SERVICE: Đã cập nhật order #${installment.order_id} sang trạng thái shipping`);
                    } else {
                        console.log(`SERVICE: Order #${installment.order_id} đã ở trạng thái '${order.orderStatus}', bỏ qua cập nhật`);
                    }
                } else {
                    console.log(`SERVICE: Không tìm thấy order #${installment.order_id}`);
                }
            } catch (orderError) {
                console.error('SERVICE: Lỗi khi cập nhật trạng thái order:', orderError);
                // Không throw error để không ảnh hưởng đến thanh toán trả trước
            }

            return await Installment.findInstallmentById(installmentId);
        } catch (error) {
            throw new Error(`SERVICE Lỗi thanh toán trả trước: ${error.message}`);
        }
    }

    /**
     * Make a payment for an installment term
     * @param {number} paymentId 
     * @param {Object} paymentData 
     * @returns {Object} Updated payment
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

            // Check contract status - ONLY allow payment when active
            const installment = await Installment.findInstallmentById(payment.installment_id);
            if (!installment) {
                throw new Error('SERVICE Không tìm thấy hợp đồng trả góp');
            }

            if (installment.status !== 'active') {
                if (installment.status === 'pending') {
                    throw new Error('SERVICE Hợp đồng đang chờ admin duyệt, chưa thể thanh toán các kỳ');
                } else if (installment.status === 'approved') {
                    throw new Error('SERVICE Vui lòng thanh toán trả trước trước khi thanh toán các kỳ');
                } else if (installment.status === 'rejected' || installment.status === 'cancelled') {
                    throw new Error('SERVICE Hợp đồng đã bị từ chối hoặc hủy, không thể thanh toán');
                } else if (installment.status === 'completed') {
                    throw new Error('SERVICE Hợp đồng đã hoàn thành');
                } else {
                    throw new Error('SERVICE Trạng thái hợp đồng không hợp lệ để thanh toán các kỳ');
                }
            }

            // Update payment status
            const updated = await InstallmentPayment.update(paymentId, {
                paid_date: paymentData.paid_date || new Date(),
                status: 'paid',
                note: paymentData.note || payment.note
            });

            if (!updated) {
                throw new Error('SERVICE Không thể cập nhật thanh toán');
            }

            // Check if all payments are paid
            const allPayments = await InstallmentPayment.findAllPaymentsByInstallmentId(payment.installment_id);
            
            const allPaid = allPayments.every(p => p.status === 'paid');
            
            if (allPaid) {
                // Update installment status to completed
                await Installment.update(payment.installment_id, {
                    ...installment,
                    status: 'completed'
                });
            }
            // No more auto-transition from pending to active
            // Must pay down payment first to set status = active

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
                    // Cập nhật trạng thái thành late (database uses 'late' instead of 'overdue')
                    await InstallmentPayment.update(payment.payment_id, {
                        ...payment,
                        status: 'late'
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
     * Generate payments cho installment (nếu chưa có)
     * @param {number} installmentId 
     * @returns {Array} Generated payments
     */
    async generatePayments(installmentId) {
        try {
            const installment = await Installment.findInstallmentById(installmentId);
            if (!installment) {
                throw new Error('SERVICE Không tìm thấy khoản trả góp');
            }

            // Check if payments already exist
            const existingPayments = await InstallmentPayment.findAllPaymentsByInstallmentId(installmentId);
            if (existingPayments.length > 0) {
                console.log(`Installment ${installmentId} already has ${existingPayments.length} payments`);
                return existingPayments;
            }

            // Generate payments
            const startDateObj = new Date(installment.start_date);
            const payments = [];

            for (let i = 1; i <= installment.num_terms; i++) {
                const dueDate = new Date(startDateObj);
                dueDate.setMonth(dueDate.getMonth() + i);

                const payment = await InstallmentPayment.create({
                    installment_id: installment.installment_id,
                    payment_no: i,
                    due_date: dueDate,
                    paid_date: null,
                    amount: installment.monthly_payment,
                    status: 'pending',
                    note: null
                });

                payments.push(payment);
            }

            console.log(`Generated ${payments.length} payments for installment ${installmentId}`);
            return payments;
        } catch (error) {
            throw new Error(`SERVICE Lỗi tạo payments: ${error.message}`);
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
            const overduePayments = payments.filter(p => p.status === 'overdue' || p.status === 'late');

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
            throw new Error(`SERVICE Lỗi tính toán tổng hợp thanh toán: ${error.message}`);
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
            console.log('SERVICE updateInstallment called with:', { installmentId, updateData });
            
            const installment = await Installment.findInstallmentById(installmentId);
            if (!installment) {
                throw new Error('SERVICE Không tìm thấy khoản trả góp');
            }

            console.log('SERVICE Found installment:', installment);

            // Chỉ pass updateData, không spread installment (vì là class instance)
            const updated = await Installment.update(installmentId, updateData);

            console.log('SERVICE Update result:', updated);

            if (!updated) {
                throw new Error('SERVICE Không thể cập nhật khoản trả góp');
            }

            // Status = approved automatically generate payments if not exist
            if (updateData.status === 'approved') {
                try {
                    // Kiểm tra và tạo payments
                    const existingPayments = await InstallmentPayment.findAllPaymentsByInstallmentId(installmentId);
                    if (existingPayments.length === 0) {
                        console.log(`SERVICE: Installment ${installmentId} approved but no payments, creating...`);
                        await this.generatePayments(installmentId);
                        console.log(`SERVICE: Created ${installment.num_terms} payments for installment ${installmentId}`);
                    }

                    // Update order status to 'processing'
                    const orderData = await Order.getById(installment.order_id);
                    if (orderData) {
                        
                        const order = new Order(orderData);
                        console.log(`SERVICE: Found order ${order.orderId} with status '${order.orderStatus}'`);
                        
                        // Update order to 'processing' if currently 'pending' or 'confirmed'
                        if (order.orderStatus === 'pending' || order.orderStatus === 'confirmed') {
                            // If pending, confirm first then process
                            if (order.orderStatus === 'pending') {
                                await order.confirm();
                                console.log(`SERVICE: Confirmed order ${order.orderId}`);
                            }
                            await order.process();
                            console.log(`SERVICE: Updated order ${order.orderId} to processing status`);
                        } else {
                            console.log(`SERVICE: Order ${order.orderId} status is '${order.orderStatus}', cannot process. Skip.`);
                        }
                    } else {
                        console.log(`SERVICE: Order ${installment.order_id} not found`);
                    }
                } catch (orderError) {
                    console.error('SERVICE: Error in approval process:', orderError.message);
                    
                }
            }

            // Fetch again to get the latest data from DB
            return await this.getInstallmentById(installmentId);
        } catch (error) {
            console.error('SERVICE Error in updateInstallment:', error);
            throw new Error(`SERVICE Lỗi cập nhật trả góp: ${error.message}`);
        }
    }

    /**
     * Delete installment (only if no payment has been made)
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

