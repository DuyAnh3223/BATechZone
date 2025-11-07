import api from '@/lib/axios';

export const attributeService = {
    // Lấy danh sách attributes
    listAttributes: async (params = {}) => {
        const response = await api.get('/attributes', { params });
        return response.data;
    },

    // Lấy attribute theo ID
    getAttribute: async (attributeId) => {
        const response = await api.get(`/attributes/${attributeId}`);
        return response.data;
    },

    // Tạo attribute mới
    createAttribute: async (attributeData) => {
        const response = await api.post('/attributes', attributeData);
        return response.data;
    },

    // Xóa attribute
    deleteAttribute: async (attributeId) => {
        const response = await api.delete(`/attributes/${attributeId}`);
        return response.data;
    }
};