import api from '@/lib/axios';

export const categoryService = {
    // Lấy danh sách categories
    listCategories: async (params = {}) => {
        const response = await api.get('/categories', { 
            params,
            withCredentials: true 
        });
        return response.data;
    },

    // Lấy category theo ID
    getCategory: async (categoryId) => {
        const response = await api.get(`/categories/${categoryId}`, { 
            withCredentials: true 
        });
        return response.data;
    },

    // Lấy danh sách categories đơn giản
    getSimpleCategories: async () => {
        const response = await api.get('/categories/simple', { 
            withCredentials: true 
        });
        return response.data;
    },

    // Tạo category mới
    createCategory: async (data) => {
        const response = await api.post('/categories', data, { 
            withCredentials: true 
        });
        return response.data;
    },

    // Cập nhật category
    updateCategory: async (categoryId, data) => {
        const response = await api.put(`/categories/${categoryId}`, data, { 
            withCredentials: true 
        });
        return response.data;
    },

    // Xóa category
    deleteCategory: async (categoryId) => {
        const response = await api.delete(`/categories/${categoryId}`, { 
            withCredentials: true 
        });
        return response.data;
    },

    // Lấy category tree
    getCategoryTree: async () => {
        const response = await api.get('/categories/tree', { 
            withCredentials: true 
        });
        // Handle both formats: { success: true, data: [...] } or [...]
        if (response.data?.success && response.data?.data) {
            return response.data.data;
        }
        return response.data || [];
    }
};