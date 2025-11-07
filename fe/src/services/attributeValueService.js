import api from '@/lib/axios';

export const attributeValueService = {
    // Lấy danh sách tất cả attribute values
    listAttributeValues: async (params = {}) => {
        const response = await api.get('/attribute-values', { params });
        return response.data;
    },

    // Lấy các values của một attribute cụ thể
    getAttributeValues: async (attributeId) => {
        const response = await api.get(`/attribute-values/${attributeId}/values`);
        return response.data;
    },

    // Tạo attribute value mới
    createAttributeValue: async (valueData) => {
        const response = await api.post('/attribute-values', valueData);
        return response.data;
    },

    // Xóa attribute value
    deleteAttributeValue: async (valueId) => {
        const response = await api.delete(`/attribute-values/${valueId}`);
        return response.data;
    }
};