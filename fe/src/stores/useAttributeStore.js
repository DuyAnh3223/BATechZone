import { create } from 'zustand';
import { toast } from 'sonner';
import { attributeService } from '@/services/attributeService';

export const useAttributeStore = create((set, get) => ({
    attributes: [],
    currentAttribute: null,
    total: 0,
    loading: false,
    error: null,

    // Lấy danh sách attributes
    fetchAttributes: async (params = {}) => {
        set({ loading: true, error: null });
        try {
            const response = await attributeService.listAttributes(params);
            set({ 
                attributes: response.data || [], 
                total: response.pagination?.total || 0,
                loading: false 
            });
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Không tải được danh sách thuộc tính';
            set({ error: message, loading: false });
            toast.error(message);
            throw error;
        }
    },

    // Lấy attribute theo ID
    fetchAttribute: async (attributeId) => {
        set({ loading: true, error: null });
        try {
            const response = await attributeService.getAttribute(attributeId);
            set({ 
                currentAttribute: response.data || response, 
                loading: false 
            });
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Không thể tải thông tin thuộc tính';
            set({ error: message, loading: false });
            toast.error(message);
            throw error;
        }
    },

    // Tạo attribute mới
    createAttribute: async (attributeData) => {
        set({ loading: true, error: null });
        try {
            const response = await attributeService.createAttribute(attributeData);
            set({ loading: false });
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Có lỗi xảy ra khi thêm thuộc tính';
            set({ error: message, loading: false });
            toast.error(message);
            throw error;
        }
    },

    // Xóa attribute
    deleteAttribute: async (attributeId) => {
        set({ loading: true, error: null });
        try {
            const response = await attributeService.deleteAttribute(attributeId);
            set((state) => ({
                attributes: state.attributes.filter(attr => attr.attribute_id !== parseInt(attributeId)),
                total: Math.max(0, (state.total || 0) - 1),
                loading: false
            }));
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Có lỗi xảy ra khi xóa thuộc tính';
            set({ error: message, loading: false });
            toast.error(message);
            throw error;
        }
    },

    // Cập nhật attribute
    updateAttribute: async (attributeId, attributeData) => {
        set({ loading: true, error: null });
        try {
            const response = await attributeService.updateAttribute(attributeId, attributeData);
            // refresh list or current attribute
            await get().fetchAttributes().catch(() => {});
            if (get().currentAttribute?.attribute_id === attributeId) {
                await get().fetchAttribute(attributeId).catch(() => {});
            }
            set({ loading: false });
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thuộc tính';
            set({ error: message, loading: false });
            toast.error(message);
            throw error;
        }
    },

    // Lấy categories của attribute
    fetchAttributeCategories: async (attributeId) => {
        set({ loading: true, error: null });
        try {
            const response = await attributeService.getAttributeCategories(attributeId);
            set({ loading: false });
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Không thể tải danh mục của thuộc tính';
            set({ error: message, loading: false });
            toast.error(message);
            throw error;
        }
    },

    // Cập nhật categories cho attribute
    updateAttributeCategories: async (attributeId, categoryIds) => {
        set({ loading: true, error: null });
        try {
            const response = await attributeService.updateAttributeCategories(attributeId, categoryIds);
            toast.success('Cập nhật danh mục thành công!');
            set({ loading: false });
            // Refresh current attribute if it's the one being updated
            if (get().currentAttribute?.attribute_id === attributeId) {
                await get().fetchAttribute(attributeId);
            }
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật danh mục';
            set({ error: message, loading: false });
            toast.error(message);
            throw error;
        }
    },

    // Xóa category khỏi attribute
    removeAttributeCategory: async (attributeId, categoryId) => {
        set({ loading: true, error: null });
        try {
            const response = await attributeService.removeAttributeCategory(attributeId, categoryId);
            toast.success('Xóa danh mục khỏi thuộc tính thành công!');
            set({ loading: false });
            // Refresh current attribute if it's the one being updated
            if (get().currentAttribute?.attribute_id === attributeId) {
                await get().fetchAttribute(attributeId);
            }
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Có lỗi xảy ra khi xóa danh mục';
            set({ error: message, loading: false });
            toast.error(message);
            throw error;
        }
    },

    // Clear error
    clearError: () => set({ error: null }),

    // Reset state
    reset: () => set({ 
        attributes: [], 
        currentAttribute: null,
        total: 0,
        loading: false, 
        error: null 
    })
}));