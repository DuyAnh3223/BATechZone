import api, { adminApi } from '@/lib/axios';

export const couponService = {
    // Láº¥y danh sÃ¡ch coupons
    listCoupons: async (params = {}) => {
        const response = await adminApi.get('/coupons', { params, withCredentials: true });
        return response.data;
    },

    // Láº¥y coupon theo ID
    getCouponById: async (couponId) => {
        const response = await adminApi.get(`/coupons/${couponId}`, { withCredentials: true });
        return response.data;
    },

    // Táº¡o coupon má»›i
    createCoupon: async (data) => {
        const response = await adminApi.post('/coupons', data, { withCredentials: true });
        return response.data;
    },

    // Cáº­p nháº­t coupon
    updateCoupon: async (couponId, data) => {
        const response = await adminApi.put(`/coupons/${couponId}`, data, { withCredentials: true });
        return response.data;
    },

    // XÃ³a coupon
    deleteCoupon: async (couponId) => {
        const response = await adminApi.delete(`/coupons/${couponId}`, { withCredentials: true });
        return response.data;
    },

    // Láº¥y danh sÃ¡ch Ä‘Æ¡n hÃ ng Ä‘Ã£ sá»­ dá»¥ng coupon
    getCouponOrders: async (couponId, params = {}) => {
        const response = await adminApi.get('/orders', { 
            params: { ...params, couponId },
            withCredentials: true 
        });
        return response.data;
    },

    // Validate coupon code vÃ  tÃ­nh toÃ¡n discount (public - used by users during checkout)
    validateCoupon: async (couponCode, subtotal = 0) => {
        const response = await api.get('/coupons/validate', {
            params: { couponCode, subtotal },
            withCredentials: true
        });
        return response.data;
    }
};
