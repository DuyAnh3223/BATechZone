import { create } from 'zustand';
import { variantService } from '@/services/variantService';

export const useVariantStore = create((set) => ({
    variants: [],
    currentVariant: null,
    loading: false,
    error: null,

    // Lấy danh sách variants
    fetchVariants: async (params) => {
        set({ loading: true, error: null });
        try {
            const response = await variantService.listVariants(params);
            set({ variants: response.data || response, loading: false });
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Lấy variant theo ID
    fetchVariant: async (variantId) => {
        set({ loading: true, error: null });
        try {
            const response = await variantService.getVariant(variantId);
            set({ currentVariant: response.data || response, loading: false });
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Tạo variant mới
    createVariant: async (data) => {
        set({ loading: true, error: null });
        try {
            const response = await variantService.createVariant(data);
            set((state) => ({
                variants: [...state.variants, response.data || response],
                loading: false
            }));
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Cập nhật variant
    updateVariant: async (variantId, data) => {
        set({ loading: true, error: null });
        try {
            const response = await variantService.updateVariant(variantId, data);
            set((state) => ({
                variants: state.variants.map(v => 
                    v.variant_id === variantId ? (response.data || response) : v
                ),
                loading: false
            }));
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Xóa variant
    deleteVariant: async (variantId) => {
        set({ loading: true, error: null });
        try {
            const response = await variantService.deleteVariant(variantId);
            set((state) => ({
                variants: state.variants.filter(v => v.variant_id !== variantId),
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
    reset: () => set({ variants: [], currentVariant: null, loading: false, error: null })
}));