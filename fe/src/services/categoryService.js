import api, { adminApi } from '@/lib/axios';

export const categoryService = {
    // Láº¥y danh sÃ¡ch categories (public - used by users to browse)
    listCategories: async (params = {}) => {
        const response = await api.get('/categories', { 
            params,
            withCredentials: true 
        });
        return response.data;
    },

    // Láº¥y category theo ID (public - used by users)
    getCategory: async (categoryId) => {
        const response = await api.get(`/categories/${categoryId}`, { 
            withCredentials: true 
        });
        return response.data;
    },

    // Láº¥y danh sÃ¡ch categories Ä'Æ¡n giáº£n (public - used by users for navigation)
    getSimpleCategories: async () => {
        const response = await api.get('/categories/simple', { 
            withCredentials: true 
        });
        return response.data;
    },

    // Táº¡o category má»›i
    createCategory: async (data) => {
        const response = await adminApi.post('/categories', data, { 
            withCredentials: true 
        });
        return response.data;
    },

    // Cáº­p nháº­t category
    updateCategory: async (categoryId, data) => {
        const response = await adminApi.put(`/categories/${categoryId}`, data, { 
            withCredentials: true 
        });
        return response.data;
    },

    // XÃ³a category
    deleteCategory: async (categoryId) => {
        const response = await adminApi.delete(`/categories/${categoryId}`, { 
            withCredentials: true 
        });
        return response.data;
    },

    // Láº¥y category tree (public - used for navigation)
    getCategoryTree: async () => {
        const response = await api.get('/categories/tree', { 
            withCredentials: true 
        });
        // Handle both formats: { success: true, data: [...] } or [...]
        if (response.data?.success && response.data?.data) {
            return response.data.data;
        }
        return response.data || [];
    },
    // Láº¥y attributes cá»§a category
    getCategoryAttributes: async (categoryId) => {
        const response = await adminApi.get(`/categories/${categoryId}/attributes`, {
            withCredentials: true
        });
        return response.data;
    },

    // Cáº­p nháº­t attributes cho category
    updateCategoryAttributes: async (categoryId, attributeIds) => {
        const response = await adminApi.put(`/categories/${categoryId}/attributes`, {
            attribute_ids: attributeIds
        }, {
            withCredentials: true
        });
        return response.data;
    },

    // XÃ³a má»™t attribute khá»i category
    removeCategoryAttribute: async (categoryId, attributeId) => {
        const response = await adminApi.delete(`/categories/${categoryId}/attributes/${attributeId}`, {
            withCredentials: true
        });
        return response.data;
    },

    // Upload áº£nh category
    uploadCategoryImage: async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        
        const response = await adminApi.post('/categories/upload-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
        });
        return response.data;
    },

    // XÃ³a áº£nh category
    deleteCategoryImage: async (imageUrl) => {
        const response = await adminApi.post('/categories/delete-image', {
            imageUrl
        }, {
            withCredentials: true
        });
        return response.data;
    }
};
