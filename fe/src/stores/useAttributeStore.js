import { create } from 'zustand';
import { attributeService } from '@/services/attributeService';

export const useAttributeStore = create((set) => ({
    attributes: [],
    currentAttribute: null,
    loading: false,
    error: null,

    // Lấy danh sách attributes
    fetchAttributes: async (params) => {
        set({ loading: true, error: null });
        try {
            const response = await attributeService.listAttributes(params);
            set({ attributes: response.data || response, loading: false });
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Lấy attribute theo ID
    fetchAttribute: async (attributeId) => {
        set({ loading: true, error: null });
        try {
            const response = await attributeService.getAttribute(attributeId);
            set({ currentAttribute: response.data || response, loading: false });
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Tạo attribute mới
    createAttribute: async (attributeData) => {
        set({ loading: true, error: null });
        try {
            const response = await attributeService.createAttribute(attributeData);
            set((state) => ({
                attributes: [...state.attributes, response.data || response],
                loading: false
            }));
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Xóa attribute
    deleteAttribute: async (attributeId) => {
        set({ loading: true, error: null });
        try {
            const response = await attributeService.deleteAttribute(attributeId);
            set((state) => ({
                attributes: state.attributes.filter(attr => attr.attribute_id !== attributeId),
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
    reset: () => set({ attributes: [], currentAttribute: null, loading: false, error: null })
}));