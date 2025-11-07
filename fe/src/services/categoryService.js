import api from '@/lib/axios';

export const categoryService = {
    // Lấy danh sách categories
    listCategories: async (params = {}) => {
        const response = await api.get('/categories', { params });
        return response.data;
    },

    // Tạo category mới
    createCategory: async (data) => {
        const response = await api.post('/categories', data);
        return response.data;
    },

    // Xóa category
    deleteCategory: async (categoryId) => {
        const response = await api.delete(`/categories/${categoryId}`);
        return response.data;
    }
};