import api from '@/lib/axios';

export const couponService = {
    // Lấy danh sách coupons
    listCoupons: async (params = {}) => {
        const response = await api.get('/coupons', { params, withCredentials: true });
        return response.data;
    },

    // Lấy coupon theo ID
    getCouponById: async (couponId) => {
        const response = await api.get(`/coupons/${couponId}`, { withCredentials: true });
        return response.data;
    },

    // Tạo coupon mới
    createCoupon: async (data) => {
        const response = await api.post('/coupons', data, { withCredentials: true });
        return response.data;
    },

    // Cập nhật coupon
    updateCoupon: async (couponId, data) => {
        const response = await api.put(`/coupons/${couponId}`, data, { withCredentials: true });
        return response.data;
    },

    // Xóa coupon
    deleteCoupon: async (couponId) => {
        const response = await api.delete(`/coupons/${couponId}`, { withCredentials: true });
        return response.data;
    },

    // Lấy danh sách đơn hàng đã sử dụng coupon
    getCouponOrders: async (couponId, params = {}) => {
        const response = await api.get('/orders', { 
            params: { ...params, couponId },
            withCredentials: true 
        });
        return response.data;
    }
};