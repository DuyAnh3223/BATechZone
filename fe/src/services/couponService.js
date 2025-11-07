import api from '@/lib/axios';

export const couponService = {
    // Lấy danh sách coupons
    listCoupons: async (params = {}) => {
        const response = await api.get('/coupons', { params });
        return response.data;
    },

    // Lấy coupon theo ID
    getCouponById: async (couponId) => {
        const response = await api.get(`/coupons/${couponId}`);
        return response.data;
    },

    // Tạo coupon mới
    createCoupon: async (data) => {
        const response = await api.post('/coupons', data);
        return response.data;
    },

    // Cập nhật coupon
    updateCoupon: async (couponId, data) => {
        const response = await api.put(`/coupons/${couponId}`, data);
        return response.data;
    },

    // Xóa coupon
    deleteCoupon: async (couponId) => {
        const response = await api.delete(`/coupons/${couponId}`);
        return response.data;
    }
};