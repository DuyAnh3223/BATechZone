import { create } from 'zustand';
import { toast } from 'sonner';
import { shippingService } from '@/services/shippingService';

export const useShippingStore = create((set, get) => ({
    provinces: [],
    districts: [],
    wards: [],
    availableServices: [],
    shippingFee: null,
    deliveryTime: null,
    loading: false,
    error: null,

    // Lấy danh sách tỉnh/thành phố
    fetchProvinces: async () => {
        try {
            set({ loading: true, error: null });
            const response = await shippingService.getProvinces();
            if (response?.success) {
                set({ provinces: response.data, loading: false });
                return response.data;
            }
            set({ provinces: [], loading: false });
            return [];
        } catch (error) {
            const message = error.response?.data?.message || 'Không thể lấy danh sách tỉnh/thành phố';
            set({ loading: false, error: message });
            toast.error(message);
            throw error;
        }
    },

    // Lấy danh sách quận/huyện theo tỉnh
    fetchDistricts: async (provinceId) => {
        try {
            set({ loading: true, error: null, districts: [], wards: [] });
            const response = await shippingService.getDistricts(provinceId);
            if (response?.success) {
                set({ districts: response.data, loading: false });
                return response.data;
            }
            set({ districts: [], loading: false });
            return [];
        } catch (error) {
            const message = error.response?.data?.message || 'Không thể lấy danh sách quận/huyện';
            set({ loading: false, error: message });
            toast.error(message);
            throw error;
        }
    },

    // Lấy danh sách phường/xã theo quận
    fetchWards: async (districtId) => {
        try {
            set({ loading: true, error: null, wards: [] });
            const response = await shippingService.getWards(districtId);
            if (response?.success) {
                set({ wards: response.data, loading: false });
                return response.data;
            }
            set({ wards: [], loading: false });
            return [];
        } catch (error) {
            const message = error.response?.data?.message || 'Không thể lấy danh sách phường/xã';
            set({ loading: false, error: message });
            toast.error(message);
            throw error;
        }
    },

    // Lấy danh sách dịch vụ vận chuyển khả dụng
    fetchAvailableServices: async (payload) => {
        try {
            set({ loading: true, error: null });
            const response = await shippingService.getAvailableServices(payload);
            if (response?.success) {
                set({ availableServices: response.data, loading: false });
                return response.data;
            }
            set({ availableServices: [], loading: false });
            return [];
        } catch (error) {
            const message = error.response?.data?.message || 'Không thể lấy danh sách dịch vụ vận chuyển';
            set({ loading: false, error: message });
            toast.error(message);
            throw error;
        }
    },

    // Tính phí vận chuyển
    calculateShippingFee: async (payload) => {
        try {
            set({ loading: true, error: null });
            const response = await shippingService.calculateShippingFee(payload);
            if (response?.success) {
                set({ shippingFee: response.data, loading: false });
                return response.data;
            }
            set({ shippingFee: null, loading: false });
            return null;
        } catch (error) {
            const message = error.response?.data?.message || 'Không thể tính phí vận chuyển';
            set({ loading: false, error: message });
            toast.error(message);
            throw error;
        }
    },

    // Tính thời gian dự kiến giao hàng
    calculateDeliveryTime: async (payload) => {
        try {
            set({ loading: true, error: null });
            const response = await shippingService.calculateDeliveryTime(payload);
            if (response?.success) {
                set({ deliveryTime: response.data, loading: false });
                return response.data;
            }
            set({ deliveryTime: null, loading: false });
            return null;
        } catch (error) {
            const message = error.response?.data?.message || 'Không thể tính thời gian giao hàng';
            set({ loading: false, error: message });
            toast.error(message);
            throw error;
        }
    },

    // Reset districts và wards khi chọn tỉnh mới
    resetDistricts: () => {
        set({ districts: [], wards: [] });
    },

    // Reset wards khi chọn quận mới
    resetWards: () => {
        set({ wards: [] });
    },

    // Reset shipping fee và delivery time
    resetShippingCalculations: () => {
        set({ shippingFee: null, deliveryTime: null });
    },

    // Reset toàn bộ store
    resetStore: () => {
        set({
            provinces: [],
            districts: [],
            wards: [],
            availableServices: [],
            shippingFee: null,
            deliveryTime: null,
            loading: false,
            error: null,
        });
    },
}));
