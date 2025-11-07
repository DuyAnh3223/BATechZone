import { create } from 'zustand';
import { couponService } from '@/services/couponService';

export const useCouponStore = create((set) => ({
    coupons: [],
    currentCoupon: null,
    loading: false,
    error: null,

    // Lấy danh sách coupons
    fetchCoupons: async (params) => {
        set({ loading: true, error: null });
        try {
            const response = await couponService.listCoupons(params);
            set({ coupons: response.data || response, loading: false });
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Lấy coupon theo ID
    fetchCoupon: async (couponId) => {
        set({ loading: true, error: null });
        try {
            const response = await couponService.getCouponById(couponId);
            set({ currentCoupon: response.data || response, loading: false });
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Tạo coupon mới
    createCoupon: async (data) => {
        set({ loading: true, error: null });
        try {
            const response = await couponService.createCoupon(data);
            set((state) => ({
                coupons: [...state.coupons, response.data || response],
                loading: false
            }));
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Cập nhật coupon
    updateCoupon: async (couponId, data) => {
        set({ loading: true, error: null });
        try {
            const response = await couponService.updateCoupon(couponId, data);
            set((state) => ({
                coupons: state.coupons.map(c => 
                    c.coupon_id === couponId ? (response.data || response) : c
                ),
                loading: false
            }));
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Xóa coupon
    deleteCoupon: async (couponId) => {
        set({ loading: true, error: null });
        try {
            const response = await couponService.deleteCoupon(couponId);
            set((state) => ({
                coupons: state.coupons.filter(c => c.coupon_id !== couponId),
                loading: false
            }));
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Clear error
    clearError: () => set({ error: null }),

    // Reset state
    reset: () => set({ coupons: [], currentCoupon: null, loading: false, error: null })
}));
