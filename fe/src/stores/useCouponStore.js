import { create } from 'zustand';
import { couponService } from '@/services/couponService';
import { toast } from 'sonner';

export const useCouponStore = create((set, get) => ({
    coupons: [],
    currentCoupon: null,
    total: 0,
    loading: false,
    error: null,

    // Lấy danh sách coupons
    fetchCoupons: async (params) => {
        set({ loading: true, error: null });
        try {
            const response = await couponService.listCoupons(params);
            const couponsData = response.data || response;
            const totalData = response.pagination?.total || couponsData.length || 0;
            
            set({ 
                coupons: Array.isArray(couponsData) ? couponsData : [], 
                total: totalData,
                loading: false 
            });
            return response;
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Không thể tải danh sách coupon';
            set({ error: message, loading: false });
            toast.error('Không thể tải danh sách coupon', {
                description: message
            });
            throw error;
        }
    },

    // Lấy coupon theo ID
    fetchCoupon: async (couponId) => {
        set({ loading: true, error: null });
        try {
            const response = await couponService.getCouponById(couponId);
            set({ 
                currentCoupon: response.data || response, 
                loading: false 
            });
            return response;
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Không thể tải thông tin coupon';
            set({ error: message, loading: false });
            toast.error('Không thể tải thông tin coupon', {
                description: message
            });
            throw error;
        }
    },

    // Tạo coupon mới
    createCoupon: async (data) => {
        set({ loading: true, error: null });
        try {
            const response = await couponService.createCoupon(data);
            const newCoupon = response.data || response;
            
            set((state) => ({
                coupons: [...state.coupons, newCoupon],
                total: state.total + 1,
                loading: false
            }));
            toast.success('Tạo coupon thành công', {
                description: `Đã tạo coupon ${data.coupon_code} thành công`
            });
            return response;
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Không thể tạo coupon mới';
            set({ error: message, loading: false });
            toast.error('Tạo coupon thất bại', {
                description: message
            });
            throw error;
        }
    },

    // Cập nhật coupon
    updateCoupon: async (couponId, data) => {
        set({ loading: true, error: null });
        try {
            const response = await couponService.updateCoupon(couponId, data);
            
            // Check if response has success flag
            if (response.success === false) {
                const message = response.message || 'Cập nhật coupon thất bại';
                set({ error: message, loading: false });
                toast.error('Cập nhật coupon thất bại', {
                    description: message
                });
                throw new Error(message);
            }
            
            const updatedCoupon = response.data || response;
            set((state) => ({
                coupons: state.coupons.map(c => 
                    c.coupon_id === couponId ? updatedCoupon : c
                ),
                loading: false
            }));
            toast.success('Cập nhật coupon thành công', {
                description: `Đã cập nhật coupon ${data.coupon_code} thành công`
            });
            return response;
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Không thể cập nhật thông tin coupon';
            set({ error: message, loading: false });
            toast.error('Cập nhật coupon thất bại', {
                description: message
            });
            throw error;
        }
    },

    // Xóa coupon
    deleteCoupon: async (couponId) => {
        set({ loading: true, error: null });
        try {
            // Lấy thông tin coupon trước khi xóa để hiển thị mã coupon trong thông báo
            const state = get();
            const couponToDelete = state.coupons.find(c => c.coupon_id === couponId);
            const couponCode = couponToDelete?.coupon_code || 'coupon';
            
            await couponService.deleteCoupon(couponId);
            set((state) => ({
                coupons: state.coupons.filter(c => c.coupon_id !== couponId),
                total: Math.max(0, state.total - 1),
                loading: false
            }));
            toast.success('Xóa coupon thành công', {
                description: `Đã xóa coupon ${couponCode} thành công`
            });
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Không thể xóa coupon';
            set({ error: message, loading: false });
            toast.error('Xóa coupon thất bại', {
                description: message
            });
            throw error;
        }
    },

    // Clear error
    clearError: () => set({ error: null }),

    // Reset state
    reset: () => set({ coupons: [], currentCoupon: null, total: 0, loading: false, error: null })
}));
