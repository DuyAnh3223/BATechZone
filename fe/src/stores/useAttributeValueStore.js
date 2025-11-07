import { create } from 'zustand';
import { attributeValueService } from '@/services/attributeValueService';

export const useAttributeValueStore = create((set) => ({
    attributeValues: [],
    currentValues: [],
    loading: false,
    error: null,

    // Lấy danh sách tất cả attribute values
    fetchAttributeValues: async (params) => {
        set({ loading: true, error: null });
        try {
            const response = await attributeValueService.listAttributeValues(params);
            set({ attributeValues: response.data || response, loading: false });
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Lấy các values của một attribute cụ thể
    fetchAttributeValuesByAttributeId: async (attributeId) => {
        set({ loading: true, error: null });
        try {
            const response = await attributeValueService.getAttributeValues(attributeId);
            set({ currentValues: response.data || response, loading: false });
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Tạo attribute value mới
    createAttributeValue: async (valueData) => {
        set({ loading: true, error: null });
        try {
            const response = await attributeValueService.createAttributeValue(valueData);
            set((state) => ({
                attributeValues: [...state.attributeValues, response.data || response],
                loading: false
            }));
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Xóa attribute value
    deleteAttributeValue: async (valueId) => {
        set({ loading: true, error: null });
        try {
            const response = await attributeValueService.deleteAttributeValue(valueId);
            set((state) => ({
                attributeValues: state.attributeValues.filter(val => val.value_id !== valueId),
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
    reset: () => set({ attributeValues: [], currentValues: [], loading: false, error: null })
}));