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
    }),

    // Fetch attributes by category
    fetchAttributesByCategory: async (categoryId) => {
        set({ loading: true, error: null });
        try {
            const response = await attributeService.getAttributesByCategory(categoryId);
            set({ 
                attributes: response.data || response || [], 
                loading: false 
            });
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Không thể tải thuộc tính của danh mục';
            set({ error: message, loading: false });
            toast.error(message);
            throw error;
        }
    },

    // Create attribute for category
    createAttributeForCategory: async (categoryId, attributeData) => {
        set({ loading: true, error: null });
        try {
            const response = await attributeService.createAttributeForCategory(categoryId, attributeData);
            // Refresh attributes for this category
            await get().fetchAttributesByCategory(categoryId);
            set({ loading: false });
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Có lỗi xảy ra khi thêm thuộc tính';
            set({ error: message, loading: false });
            toast.error(message);
            throw error;
        }
    },

    // Update attribute category (e.g., is_variant_attribute)
    updateAttributeCategory: async (attributeCategoryId, data) => {
        set({ loading: true, error: null });
        try {
            const response = await attributeService.updateAttributeCategory(attributeCategoryId, data);
            set({ loading: false });
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thuộc tính';
            set({ error: message, loading: false });
            toast.error(message);
            throw error;
        }
    },

    // Remove attribute from category
    removeAttributeFromCategory: async (categoryId, attributeCategoryId) => {
        set({ loading: true, error: null });
        try {
            const response = await attributeService.removeAttributeFromCategory(categoryId, attributeCategoryId);
            // Refresh attributes for this category
            await get().fetchAttributesByCategory(categoryId);
            set({ loading: false });
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Có lỗi xảy ra khi xóa thuộc tính';
            set({ error: message, loading: false });
            toast.error(message);
            throw error;
        }
    },

    // Fetch attribute values for a category attribute
    fetchAttributeValues: async (attributeCategoryId) => {
        try {
            const response = await attributeService.getAttributeValues(attributeCategoryId);
            return response.data || response || [];
        } catch (error) {
            const message = error.response?.data?.message || 'Không thể tải giá trị thuộc tính';
            toast.error(message);
            throw error;
        }
    },

    // Add attribute value
    addAttributeValue: async (attributeCategoryId, valueData) => {
        try {
            const response = await attributeService.addAttributeValue(attributeCategoryId, valueData);
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Có lỗi xảy ra khi thêm giá trị';
            toast.error(message);
            throw error;
        }
    },

    // Remove attribute value
    removeAttributeValue: async (attributeCategoryId, valueId) => {
        try {
            const response = await attributeService.removeAttributeValue(attributeCategoryId, valueId);
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Có lỗi xảy ra khi xóa giá trị';
            toast.error(message);
            throw error;
        }
    }
}));