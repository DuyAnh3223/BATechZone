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
    }
};