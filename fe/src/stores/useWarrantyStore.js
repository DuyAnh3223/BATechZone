import { create } from 'zustand';
import { toast } from 'sonner';
import { serviceRequestService } from '@/services/serviceRequestService';
import warrantyService from '@/services/warrantyService';

export const useWarrantyStore = create((set, get) => ({
    myProducts: [],
    myRequests: [],
    currentRequest: null,
    warrantyInfo: null,
    loading: false,
    error: null,

    fetchMyProducts: async () => {
        set({ loading: true, error: null });
        try {
            const response = await serviceRequestService.getMyProducts();
            set({ myProducts: response.data || [], loading: false });
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Không thể tải danh sách sản phẩm';
            set({ error: message, loading: false });
            toast.error(message);
            throw error;
        }
    },

    createWarrantyRequest: async (formData) => {
        set({ loading: true, error: null });
        try {
            const response = await serviceRequestService.createRequest(formData);
            await get().fetchMyRequests();
            set({ loading: false });
            toast.success('Yêu cầu bảo hành đã được gửi thành công');
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Không thể gửi yêu cầu bảo hành';
            set({ error: message, loading: false });
            toast.error(message);
            throw error;
        }
    },

    fetchMyRequests: async (params = {}) => {
        set({ loading: true, error: null });
        try {
            const response = await serviceRequestService.getMyRequests(params);
            set({ myRequests: response.data || [], loading: false });
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Không thể tải danh sách yêu cầu';
            set({ error: message, loading: false });
            toast.error(message);
            throw error;
        }
    },

    fetchRequestDetail: async (requestId) => {
        set({ loading: true, error: null });
        try {
            const response = await serviceRequestService.getRequestDetail(requestId);
            set({ currentRequest: response.data || response, loading: false });
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Không thể tải chi tiết yêu cầu';
            set({ error: message, loading: false });
            toast.error(message);
            throw error;
        }
    },

    cancelRequest: async (requestId, reason) => {
        set({ loading: true, error: null });
        try {
            const response = await serviceRequestService.cancelRequest(requestId, reason);
            await get().fetchMyRequests();
            set({ loading: false });
            toast.success('Đã hủy yêu cầu bảo hành');
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Không thể hủy yêu cầu';
            set({ error: message, loading: false });
            toast.error(message);
            throw error;
        }
    },

    lookupWarrantyBySerial: async (serialNumber) => {
        set({ loading: true, error: null, warrantyInfo: null });
        try {
            const response = await warrantyService.lookupWarrantyBySerial(serialNumber);
            if (response.success) {
                set({ warrantyInfo: response.data, loading: false });
                if (!response.data.isValid) {
                    toast.warning('Sản phẩm không còn trong thời hạn bảo hành');
                } else {
                    toast.success('Tìm thấy thông tin bảo hành');
                }
            } else {
                set({ warrantyInfo: null, loading: false });
                toast.error(response.message || 'Không tìm thấy thông tin bảo hành');
            }
            return response;
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Không tìm thấy serial number này';
            set({ error: message, loading: false, warrantyInfo: null });
            toast.error(message);
            throw error;
        }
    },

    clearWarrantyInfo: () => set({ warrantyInfo: null }),

    clearError: () => set({ error: null }),
    
    reset: () => set({ 
        myProducts: [], 
        myRequests: [],
        currentRequest: null,
        warrantyInfo: null,
        loading: false, 
        error: null 
    })
}));
