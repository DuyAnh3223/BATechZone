import { create } from 'zustand';
import { categoryService } from '@/services/categoryService';

export const useCategoryStore = create((set) => ({
    categories: [],
    loading: false,
    error: null,

    // Lấy danh sách categories
    fetchCategories: async (params) => {
        set({ loading: true, error: null });
        try {
            const response = await categoryService.listCategories(params);
            set({ categories: response.data || response, loading: false });
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Tạo category mới
    createCategory: async (data) => {
        set({ loading: true, error: null });
        try {
            const response = await categoryService.createCategory(data);
            set((state) => ({
                categories: [...state.categories, response.data || response],
                loading: false
            }));
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Xóa category
    deleteCategory: async (categoryId) => {
        set({ loading: true, error: null });
        try {
            const response = await categoryService.deleteCategory(categoryId);
            set((state) => ({
                categories: state.categories.filter(cat => cat.category_id !== categoryId),
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
    reset: () => set({ categories: [], loading: false, error: null })
}));