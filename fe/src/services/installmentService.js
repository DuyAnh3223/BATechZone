import { userApi, adminApi } from '@/lib/axios';

export const installmentService = {
    /**
     * Táº¡o khoáº£n tráº£ gÃ³p má»›i
     * @param {Object} data - Dá»¯ liá»‡u tráº£ gÃ³p
     * @param {number} data.order_id - ID Ä‘Æ¡n hÃ ng
     * @param {number} data.user_id - ID ngÆ°á»i dÃ¹ng
     * @param {number} data.total_amount - Tá»•ng sá»‘ tiá»n
     * @param {number} data.down_payment - Sá»‘ tiá»n tráº£ trÆ°á»›c
     * @param {number} data.num_terms - Sá»‘ ká»³ tráº£ gÃ³p
     * @param {number} data.interest_rate - LÃ£i suáº¥t (%)
     * @param {Date} data.start_date - NgÃ y báº¯t Ä‘áº§u
     */
    createInstallment: async (data) => {
        const response = await userApi.post('/installments', data, {
            withCredentials: true
        });
        return response.data;
    },

    /**
     * Láº¥y chi tiáº¿t khoáº£n tráº£ gÃ³p theo ID
     * @param {number} installmentId 
     * @param {boolean} isAdmin - True if called from admin context
     */
    getInstallmentById: async (installmentId, isAdmin = false) => {
        const api = isAdmin ? adminApi : userApi;
        const response = await api.get(`/installments/${installmentId}`, {
            withCredentials: true
        });
        return response.data;
    },

    /**
     * Láº¥y tá»•ng há»£p thÃ´ng tin thanh toÃ¡n
     * @param {number} installmentId 
     * @param {boolean} isAdmin - True if called from admin context
     */
    getPaymentSummary: async (installmentId, isAdmin = false) => {
        const api = isAdmin ? adminApi : userApi;
        const response = await api.get(`/installments/${installmentId}/summary`, {
            withCredentials: true
        });
        return response.data;
    },

    /**
     * Kiá»ƒm tra cÃ¡c khoáº£n thanh toÃ¡n quÃ¡ háº¡n
     * @param {number} installmentId 
     * @param {boolean} isAdmin - True if called from admin context
     */
    checkOverduePayments: async (installmentId, isAdmin = false) => {
        const api = isAdmin ? adminApi : userApi;
        const response = await api.get(`/installments/${installmentId}/overdue`, {
            withCredentials: true
        });
        return response.data;
    },

    /**
     * Láº¥y táº¥t cáº£ khoáº£n tráº£ gÃ³p cá»§a má»™t user (admin only)
     * @param {number} userId 
     */
    getInstallmentsByUserId: async (userId) => {
        const response = await userApi.get(`/installments/user/${userId}`, {
            withCredentials: true
        });
        return response.data;
    },

    /**
     * Láº¥y thÃ´ng tin tráº£ gÃ³p theo order_id (admin only)
     * @param {number} orderId 
     */
    getInstallmentByOrderId: async (orderId) => {
        const response = await userApi.get(`/installments/order/${orderId}`, {
            withCredentials: true
        });
        return response.data;
    },

    /**
     * Láº¥y danh sÃ¡ch khoáº£n tráº£ gÃ³p cá»§a user hiá»‡n táº¡i (tá»« session)
     */
    getMyInstallments: async () => {
        const response = await userApi.get('/installments/me/list', {
            withCredentials: true
        });
        return response.data;
    },

    /**
     * Thanh toÃ¡n tráº£ trÆ°á»›c (down payment)
     * @param {number} installmentId - ID cá»§a installment
     * @param {Object} data - Dá»¯ liá»‡u thanh toÃ¡n
     * @param {Date} data.paid_date - NgÃ y thanh toÃ¡n (optional)
     * @param {string} data.note - Ghi chÃº (optional)
     */
    makeDownPayment: async (installmentId, data = {}) => {
        const response = await userApi.post(`/installments/${installmentId}/pay-down-payment`, data, {
            withCredentials: true
        });
        return response.data;
    },

    /**
     * Thanh toÃ¡n má»™t ká»³ tráº£ gÃ³p
     * @param {number} paymentId - ID cá»§a ká»³ thanh toÃ¡n
     * @param {Object} data - Dá»¯ liá»‡u thanh toÃ¡n
     * @param {Date} data.paid_date - NgÃ y thanh toÃ¡n (optional)
     * @param {string} data.note - Ghi chÃº (optional)
     */
    makePayment: async (paymentId, data = {}) => {
        const response = await userApi.post(`/installments/payments/${paymentId}/pay`, data, {
            withCredentials: true
        });
        return response.data;
    },

    /**
     * Cáº­p nháº­t thÃ´ng tin khoáº£n tráº£ gÃ³p
     * @param {number} installmentId 
     * @param {Object} data - Dá»¯ liá»‡u cáº§n cáº­p nháº­t
     * @param {boolean} isAdmin - True if called from admin context
     */
    updateInstallment: async (installmentId, data, isAdmin = false) => {
        const api = isAdmin ? adminApi : userApi;
        const response = await api.put(`/installments/${installmentId}`, data, {
            withCredentials: true
        });
        return response.data;
    },

    /**
     * Há»§y khoáº£n tráº£ gÃ³p
     * @param {number} installmentId 
     */
    cancelInstallment: async (installmentId) => {
        const response = await userApi.patch(`/installments/${installmentId}/cancel`, {}, {
            withCredentials: true
        });
        return response.data;
    },

    /**
     * XÃ³a khoáº£n tráº£ gÃ³p (chá»‰ náº¿u chÆ°a cÃ³ payment nÃ o Ä‘Æ°á»£c thanh toÃ¡n)
     * @param {number} installmentId 
     */
    deleteInstallment: async (installmentId) => {
        const response = await userApi.delete(`/installments/${installmentId}`, {
            withCredentials: true
        });
        return response.data;
    },

    /**
     * TÃ­nh toÃ¡n sá»‘ tiá»n tráº£ hÃ ng thÃ¡ng (client-side helper)
     * @param {number} totalAmount - Tá»•ng sá»‘ tiá»n
     * @param {number} downPayment - Sá»‘ tiá»n tráº£ trÆ°á»›c
     * @param {number} numTerms - Sá»‘ ká»³
     * @param {number} interestRate - LÃ£i suáº¥t (%)
     * @returns {number} Sá»‘ tiá»n tráº£ hÃ ng thÃ¡ng
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
     * TÃ­nh tá»•ng sá»‘ tiá»n pháº£i tráº£ (bao gá»“m lÃ£i)
     * @param {number} totalAmount - Tá»•ng sá»‘ tiá»n
     * @param {number} downPayment - Sá»‘ tiá»n tráº£ trÆ°á»›c
     * @param {number} numTerms - Sá»‘ ká»³
     * @param {number} interestRate - LÃ£i suáº¥t (%)
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
     * Láº¥y táº¥t cáº£ installments (Admin only)
     */
    getAllInstallments: async () => {
        const response = await adminApi.get('/installments/all/list', {
            withCredentials: true
        });
        return response.data;
    },

    /**
     * Láº¥y táº¥t cáº£ payments quÃ¡ háº¡n (Admin only)
     */
    getAllOverduePayments: async () => {
        const response = await adminApi.get('/installments/overdue/all', {
            withCredentials: true
        });
        return response.data;
    },

    /**
     * Láº¥y thá»‘ng kÃª tá»•ng quan (Admin only)
     */
    getStatistics: async () => {
        const response = await adminApi.get('/installments/statistics', {
            withCredentials: true
        });
        return response.data;
    }
};

