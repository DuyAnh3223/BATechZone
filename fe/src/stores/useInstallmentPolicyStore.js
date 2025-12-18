import { create } from 'zustand';
import { toast } from 'sonner';
import { installmentPolicyService } from '@/services/installmentPolicyService';

export const useInstallmentPolicyStore = create((set, get) => ({
    policies: [],
    activePolicies: [],
    loading: false,
    error: null,

    // Lấy tất cả chính sách (Admin)
    fetchAllPolicies: async () => {
        try {
            set({ loading: true, error: null });
            const response = await installmentPolicyService.getAllPolicies();
            if (response?.success) {
                set({ policies: response.data, loading: false });
                return response.data;
            } else {
                set({ policies: [], loading: false });
                return [];
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Không thể lấy danh sách chính sách trả góp';
            set({ loading: false, error: message });
            toast.error(message);
            throw error;
        }
    },

    // Lấy chính sách đang hoạt động (Public)
    fetchActivePolicies: async () => {
        try {
            set({ loading: true, error: null });
            const response = await installmentPolicyService.getActivePolicies();
            if (response?.success) {
                set({ activePolicies: response.data, loading: false });
                return response.data;
            } else {
                set({ activePolicies: [], loading: false });
                return [];
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Không thể lấy danh sách chính sách trả góp';
            set({ loading: false, error: message });
            toast.error(message);
            throw error;
        }
    },

    // Tạo chính sách mới (Admin)
    createPolicy: async (data) => {
        try {
            set({ loading: true, error: null });
            const response = await installmentPolicyService.createPolicy(data);
            if (response?.success) {
                // Refresh danh sách sau khi tạo
                await get().fetchAllPolicies();
                set({ loading: false });
                toast.success('Tạo chính sách trả góp thành công');
                return response.data;
            } else {
                set({ loading: false });
                toast.error('Không thể tạo chính sách');
                return null;
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Không thể tạo chính sách trả góp';
            set({ loading: false, error: message });
            toast.error(message);
            throw error;
        }
    },

    // Cập nhật chính sách (Admin)
    updatePolicy: async (id, data) => {
        try {
            set({ loading: true, error: null });
            const response = await installmentPolicyService.updatePolicy(id, data);
            if (response?.success) {
                // Refresh danh sách sau khi cập nhật
                await get().fetchAllPolicies();
                set({ loading: false });
                toast.success('Cập nhật chính sách thành công');
                return true;
            } else {
                set({ loading: false });
                toast.error('Không thể cập nhật chính sách');
                return false;
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Không thể cập nhật chính sách trả góp';
            set({ loading: false, error: message });
            toast.error(message);
            throw error;
        }
    },

    // Xóa chính sách (Admin)
    deletePolicy: async (id) => {
        try {
            set({ loading: true, error: null });
            const response = await installmentPolicyService.deletePolicy(id);
            if (response?.success) {
                // Cập nhật state local ngay lập tức
                set((state) => ({
                    policies: state.policies.filter(p => p.policy_id !== id),
                    loading: false
                }));
                toast.success('Xóa chính sách thành công');
                return true;
            } else {
                set({ loading: false });
                toast.error('Không thể xóa chính sách');
                return false;
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Không thể xóa chính sách trả góp';
            set({ loading: false, error: message });
            toast.error(message);
            throw error;
        }
    },

    // Toggle trạng thái (Admin)
    togglePolicyStatus: async (id) => {
        try {
            set({ loading: true, error: null });
            const response = await installmentPolicyService.togglePolicyStatus(id);
            if (response?.success) {
                // Cập nhật state local
                set((state) => ({
                    policies: state.policies.map(p => 
                        p.policy_id === id 
                            ? { ...p, is_active: response.data.is_active }
                            : p
                    ),
                    loading: false
                }));
                const message = response.data.is_active === 1 
                    ? 'Đã kích hoạt chính sách' 
                    : 'Đã tạm ngưng chính sách';
                toast.success(message);
                return true;
            } else {
                set({ loading: false });
                toast.error('Không thể thay đổi trạng thái');
                return false;
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Không thể thay đổi trạng thái chính sách';
            set({ loading: false, error: message });
            toast.error(message);
            throw error;
        }
    },

    // Reset error
    clearError: () => set({ error: null }),

    // Reset store
    reset: () => set({
        policies: [],
        activePolicies: [],
        loading: false,
        error: null
    })
}));
