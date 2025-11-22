import InstallmentService from '../services/InstallmentService.js';

/**
 * Tạo khoản trả góp mới
 */
export const createInstallment = async (req, res) => {
    try {
        const {
            order_id,
            user_id,
            total_amount,
            down_payment,
            num_terms,
            interest_rate,
            start_date
        } = req.body;

        // Validation
        if (!order_id || !user_id || !total_amount || !num_terms) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu thông tin bắt buộc: order_id, user_id, total_amount, num_terms'
            });
        }

        if (total_amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Tổng số tiền phải lớn hơn 0'
            });
        }

        if (down_payment < 0 || down_payment >= total_amount) {
            return res.status(400).json({
                success: false,
                message: 'Số tiền trả trước không hợp lệ'
            });
        }

        if (num_terms <= 0 || num_terms > 36) {
            return res.status(400).json({
                success: false,
                message: 'Số kỳ trả góp phải từ 1-36 tháng'
            });
        }

        if (interest_rate < 0 || interest_rate > 100) {
            return res.status(400).json({
                success: false,
                message: 'Lãi suất phải từ 0-100%'
            });
        }

        const result = await InstallmentService.createInstallment({
            order_id,
            user_id,
            total_amount: parseFloat(total_amount),
            down_payment: parseFloat(down_payment || 0),
            num_terms: parseInt(num_terms),
            interest_rate: parseFloat(interest_rate || 0),
            start_date: start_date || new Date()
        });

        res.status(201).json({
            success: true,
            message: 'Tạo khoản trả góp thành công',
            data: result
        });
    } catch (error) {
        console.error('CONTROLLER Error creating installment:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Lỗi khi tạo khoản trả góp',
            error: error.message
        });
    }
};

/**
 * Lấy thông tin trả góp theo ID
 */
export const getInstallmentById = async (req, res) => {
    try {
        const { installmentId } = req.params;

        if (!installmentId) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu installment_id'
            });
        }

        const installment = await InstallmentService.getInstallmentById(parseInt(installmentId));

        res.json({
            success: true,
            data: installment
        });
    } catch (error) {
        console.error('CONTROLLER Error getting installment:', error);
        
        if (error.message.includes('Không tìm thấy')) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin trả góp',
            error: error.message
        });
    }
};

/**
 * Lấy tất cả khoản trả góp của user
 */
export const getInstallmentsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu user_id'
            });
        }

        const installments = await InstallmentService.getInstallmentsByUserId(parseInt(userId));

        res.json({
            success: true,
            count: installments.length,
            data: installments
        });
    } catch (error) {
        console.error('CONTROLLERError getting user installments:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách trả góp',
            error: error.message
        });
    }
};

/**
 * Thanh toán một kỳ trả góp
 */
export const makePayment = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const { paid_date, note } = req.body;

        if (!paymentId) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu payment_id'
            });
        }

        const payment = await InstallmentService.makePayment(parseInt(paymentId), {
            paid_date: paid_date || new Date(),
            note
        });

        res.json({
            success: true,
            message: 'Thanh toán thành công',
            data: payment
        });
    } catch (error) {
        console.error('CONTROLLERError making payment:', error);
        
        if (error.message.includes('Không tìm thấy') || error.message.includes('đã được thanh toán')) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Lỗi khi thanh toán',
            error: error.message
        });
    }
};

/**
 * Kiểm tra các khoản thanh toán quá hạn
 */
export const checkOverduePayments = async (req, res) => {
    try {
        const { installmentId } = req.params;

        if (!installmentId) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu installment_id'
            });
        }

        const overduePayments = await InstallmentService.checkOverduePayments(parseInt(installmentId));

        res.json({
            success: true,
            count: overduePayments.length,
            data: overduePayments
        });
    } catch (error) {
        console.error('CONTROLLERError checking overdue payments:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi kiểm tra thanh toán quá hạn',
            error: error.message
        });
    }
};

/**
 * Hủy khoản trả góp
 */
export const cancelInstallment = async (req, res) => {
    try {
        const { installmentId } = req.params;

        if (!installmentId) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu installment_id'
            });
        }

        const result = await InstallmentService.cancelInstallment(parseInt(installmentId));

        res.json({
            success: true,
            message: 'Hủy khoản trả góp thành công',
            data: { cancelled: result }
        });
    } catch (error) {
        console.error('CONTROLLERError cancelling installment:', error);
        
        if (error.message.includes('Không tìm thấy') || error.message.includes('Không thể hủy')) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Lỗi khi hủy trả góp',
            error: error.message
        });
    }
};

/**
 * Lấy tổng hợp thông tin thanh toán
 */
export const getPaymentSummary = async (req, res) => {
    try {
        const { installmentId } = req.params;

        if (!installmentId) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu installment_id'
            });
        }

        const summary = await InstallmentService.getPaymentSummary(parseInt(installmentId));

        res.json({
            success: true,
            data: summary
        });
    } catch (error) {
        console.error('CONTROLLERError getting payment summary:', error);
        
        if (error.message.includes('Không tìm thấy')) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy tổng hợp thanh toán',
            error: error.message
        });
    }
};

/**
 * Cập nhật thông tin khoản trả góp
 */
export const updateInstallment = async (req, res) => {
    try {
        const { installmentId } = req.params;
        const updateData = req.body;

        if (!installmentId) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu installment_id'
            });
        }

        // Không cho phép cập nhật một số field quan trọng
        const restrictedFields = ['installment_id', 'order_id', 'user_id', 'created_at'];
        restrictedFields.forEach(field => {
            if (updateData[field]) {
                delete updateData[field];
            }
        });

        const installment = await InstallmentService.updateInstallment(parseInt(installmentId), updateData);

        res.json({
            success: true,
            message: 'Cập nhật khoản trả góp thành công',
            data: installment
        });
    } catch (error) {
        console.error('CONTROLLERError updating installment:', error);
        
        if (error.message.includes('Không tìm thấy')) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật trả góp',
            error: error.message
        });
    }
};

/**
 * Xóa khoản trả góp
 */
export const deleteInstallment = async (req, res) => {
    try {
        const { installmentId } = req.params;

        if (!installmentId) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu installment_id'
            });
        }

        const result = await InstallmentService.deleteInstallment(parseInt(installmentId));

        res.json({
            success: true,
            message: 'Xóa khoản trả góp thành công',
            data: { deleted: result }
        });
    } catch (error) {
        console.error('CONTROLLERError deleting installment:', error);
        
        if (error.message.includes('Không thể xóa')) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa trả góp',
            error: error.message
        });
    }
};

/**
 * Lấy danh sách khoản trả góp của user hiện tại (từ session)
 */
export const getMyInstallments = async (req, res) => {
    try {
        // user_id từ session đã được gán vào req.user bởi authMiddleware
        console.log('getMyInstallments - req.user:', req.user);
        const userId = req.user?.user_id;

        if (!userId) {
            console.log('getMyInstallments - No userId found in req.user');
            return res.status(401).json({
                success: false,
                message: 'Không xác định được user'
            });
        }

        const installments = await InstallmentService.getInstallmentsByUserId(userId);

        res.json({
            success: true,
            count: installments.length,
            data: installments
        });
    } catch (error) {
        console.error('CONTROLLERError getting my installments:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách trả góp',
            error: error.message
        });
    }
};

/**
 * Lấy tất cả installments (Admin only)
 */
export const getAllInstallments = async (req, res) => {
    try {
        console.log('CONTROLLER: Fetching all installments...');
        const installments = await InstallmentService.getAllInstallments();
        console.log('CONTROLLER: Received installments:', installments.length);

        res.json({
            success: true,
            count: installments.length,
            data: installments
        });
    } catch (error) {
        console.error('CONTROLLER Error getting all installments:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách trả góp',
            error: error.message
        });
    }
};

/**
 * Lấy tất cả payments quá hạn (Admin only)
 */
export const getAllOverduePayments = async (req, res) => {
    try {
        const overduePayments = await InstallmentService.getAllOverduePayments();

        res.json({
            success: true,
            count: overduePayments.length,
            data: overduePayments
        });
    } catch (error) {
        console.error('Error getting overdue payments:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách quá hạn',
            error: error.message
        });
    }
};

/**
 * Lấy thống kê tổng quan (Admin only)
 */
export const getStatistics = async (req, res) => {
    try {
        const statistics = await InstallmentService.getStatistics();

        res.json({
            success: true,
            data: statistics
        });
    } catch (error) {
        console.error('Error getting statistics:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thống kê',
            error: error.message
        });
    }
};
