import api from '@/lib/axios';

export const installmentService = {
    /**
     * Tạo khoản trả góp mới
     * @param {Object} data - Dữ liệu trả góp
     * @param {number} data.order_id - ID đơn hàng
     * @param {number} data.user_id - ID người dùng
     * @param {number} data.total_amount - Tổng số tiền
     * @param {number} data.down_payment - Số tiền trả trước
     * @param {number} data.num_terms - Số kỳ trả góp
     * @param {number} data.interest_rate - Lãi suất (%)
     * @param {Date} data.start_date - Ngày bắt đầu
     */
    createInstallment: async (data) => {
        const response = await api.post('/installments', data, {
            withCredentials: true
        });
        return response.data;
    },

    /**
     * Lấy chi tiết khoản trả góp theo ID
     * @param {number} installmentId 
     */
    getInstallmentById: async (installmentId) => {
        const response = await api.get(`/installments/${installmentId}`, {
            withCredentials: true
        });
        return response.data;
    },

    /**
     * Lấy tổng hợp thông tin thanh toán
     * @param {number} installmentId 
     */
    getPaymentSummary: async (installmentId) => {
        const response = await api.get(`/installments/${installmentId}/summary`, {
            withCredentials: true
        });
        return response.data;
    },

    /**
     * Kiểm tra các khoản thanh toán quá hạn
     * @param {number} installmentId 
     */
    checkOverduePayments: async (installmentId) => {
        const response = await api.get(`/installments/${installmentId}/overdue`, {
            withCredentials: true
        });
        return response.data;
    },

    /**
     * Lấy tất cả khoản trả góp của một user (admin only)
     * @param {number} userId 
     */
    getInstallmentsByUserId: async (userId) => {
        const response = await api.get(`/installments/user/${userId}`, {
            withCredentials: true
        });
        return response.data;
    },

    /**
     * Lấy danh sách khoản trả góp của user hiện tại (từ session)
     */
    getMyInstallments: async () => {
        const response = await api.get('/installments/me/list', {
            withCredentials: true
        });
        return response.data;
    },

    /**
     * Thanh toán một kỳ trả góp
     * @param {number} paymentId - ID của kỳ thanh toán
     * @param {Object} data - Dữ liệu thanh toán
     * @param {Date} data.paid_date - Ngày thanh toán (optional)
     * @param {string} data.note - Ghi chú (optional)
     */
    makePayment: async (paymentId, data = {}) => {
        const response = await api.post(`/installments/payments/${paymentId}/pay`, data, {
            withCredentials: true
        });
        return response.data;
    },

    /**
     * Cập nhật thông tin khoản trả góp
     * @param {number} installmentId 
     * @param {Object} data - Dữ liệu cần cập nhật
     */
    updateInstallment: async (installmentId, data) => {
        const response = await api.put(`/installments/${installmentId}`, data, {
            withCredentials: true
        });
        return response.data;
    },

    /**
     * Hủy khoản trả góp
     * @param {number} installmentId 
     */
    cancelInstallment: async (installmentId) => {
        const response = await api.patch(`/installments/${installmentId}/cancel`, {}, {
            withCredentials: true
        });
        return response.data;
    },

    /**
     * Xóa khoản trả góp (chỉ nếu chưa có payment nào được thanh toán)
     * @param {number} installmentId 
     */
    deleteInstallment: async (installmentId) => {
        const response = await api.delete(`/installments/${installmentId}`, {
            withCredentials: true
        });
        return response.data;
    },

    /**
     * Tính toán số tiền trả hàng tháng (client-side helper)
     * @param {number} totalAmount - Tổng số tiền
     * @param {number} downPayment - Số tiền trả trước
     * @param {number} numTerms - Số kỳ
     * @param {number} interestRate - Lãi suất (%)
     * @returns {number} Số tiền trả hàng tháng
     */
    calculateMonthlyPayment: (totalAmount, downPayment, numTerms, interestRate = 0) => {
        const remainingAmount = totalAmount - downPayment;
        
        if (interestRate <= 0) {
            return remainingAmount / numTerms;
        }

        const monthlyInterestRate = interestRate / 100 / 12;
        const monthlyPayment = (remainingAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numTerms)) 
            / (Math.pow(1 + monthlyInterestRate, numTerms) - 1);
        
        return Math.round(monthlyPayment * 100) / 100;
    },

    /**
     * Tính tổng số tiền phải trả (bao gồm lãi)
     * @param {number} totalAmount - Tổng số tiền
     * @param {number} downPayment - Số tiền trả trước
     * @param {number} numTerms - Số kỳ
     * @param {number} interestRate - Lãi suất (%)
     * @returns {Object} { monthlyPayment, totalPayment, totalInterest }
     */
    calculateInstallmentDetails: (totalAmount, downPayment, numTerms, interestRate = 0) => {
        const monthlyPayment = installmentService.calculateMonthlyPayment(
            totalAmount, 
            downPayment, 
            numTerms, 
            interestRate
        );
        
        const totalPayment = downPayment + (monthlyPayment * numTerms);
        const totalInterest = totalPayment - totalAmount;
        
        return {
            monthlyPayment: Math.round(monthlyPayment * 100) / 100,
            totalPayment: Math.round(totalPayment * 100) / 100,
            totalInterest: Math.round(totalInterest * 100) / 100,
            remainingAmount: totalAmount - downPayment
        };
    },

    /**
     * Lấy tất cả installments (Admin only)
     */
    getAllInstallments: async () => {
        const response = await api.get('/installments/all/list', {
            withCredentials: true
        });
        return response.data;
    },

    /**
     * Lấy tất cả payments quá hạn (Admin only)
     */
    getAllOverduePayments: async () => {
        const response = await api.get('/installments/overdue/all', {
            withCredentials: true
        });
        return response.data;
    },

    /**
     * Lấy thống kê tổng quan (Admin only)
     */
    getStatistics: async () => {
        const response = await api.get('/installments/statistics', {
            withCredentials: true
        });
        return response.data;
    }
};
