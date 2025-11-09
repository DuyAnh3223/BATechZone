import api from '@/lib/axios';

export const attributeService = {
    // Lấy danh sách attributes
    listAttributes: async (params = {}) => {
        const response = await api.get('/attributes', { 
            params,
            withCredentials: true 
        });
        return response.data;
    },

    // Lấy attribute theo ID
    getAttribute: async (attributeId) => {
        const response = await api.get(`/attributes/${attributeId}`, {
            withCredentials: true
        });
        return response.data;
    },

    // Tạo attribute mới
    createAttribute: async (attributeData) => {
        const response = await api.post('/attributes', attributeData, {
            withCredentials: true
        });
        return response.data;
    },

    // Cập nhật attribute
    updateAttribute: async (attributeId, attributeData) => {
        const response = await api.put(`/attributes/${attributeId}`, attributeData, {
            withCredentials: true
        });
        return response.data;
    },

    // Xóa attribute
    deleteAttribute: async (attributeId) => {
        const response = await api.delete(`/attributes/${attributeId}`, {
            withCredentials: true
        });
        return response.data;
    },

    // Lấy attributes theo category
    getAttributesByCategory: async (categoryId) => {
        const response = await api.get('/attributes', {
            params: { category_id: categoryId },
            withCredentials: true
        });
        return response.data;
    },

    // Lấy categories của attribute
    getAttributeCategories: async (attributeId) => {
        const response = await api.get(`/attributes/${attributeId}/categories`, {
            withCredentials: true
        });
        return response.data;
    },

    // Cập nhật categories cho attribute
    updateAttributeCategories: async (attributeId, categoryIds) => {
        const response = await api.put(`/attributes/${attributeId}/categories`, {
            category_ids: categoryIds
        }, {
            withCredentials: true
        });
        return response.data;
    },

    // Xóa một category khỏi attribute
    removeAttributeCategory: async (attributeId, categoryId) => {
        const response = await api.delete(`/attributes/${attributeId}/categories/${categoryId}`, {
            withCredentials: true
        });
        return response.data;
    }
};