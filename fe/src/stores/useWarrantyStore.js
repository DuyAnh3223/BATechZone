import { create } from 'zustand';
import { toast } from 'sonner';
import { serviceRequestService } from '@/services/serviceRequestService';

export const useWarrantyStore = create((set, get) => ({
    myProducts: [],
    myRequests: [],
    currentRequest: null,
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

    clearError: () => set({ error: null }),
    
    reset: () => set({ 
        myProducts: [], 
        myRequests: [],
        currentRequest: null,
        loading: false, 
        error: null 
    })
}));
