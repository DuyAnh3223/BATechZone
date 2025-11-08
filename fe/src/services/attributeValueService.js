import api from '@/lib/axios';

export const attributeValueService = {
    // Lấy danh sách tất cả attribute values
    listAttributeValues: async (params = {}) => {
        const response = await api.get('/attribute-values', { 
            params,
            withCredentials: true 
        });
        return response.data;
    },

    // Lấy các values của một attribute cụ thể
    getAttributeValues: async (attributeId) => {
        const response = await api.get(`/attribute-values/${attributeId}/values`, {
            withCredentials: true
        });
        return response.data;
    },

    // Tạo attribute value mới
    createAttributeValue: async (valueData) => {
        const response = await api.post('/attribute-values', valueData, {
            withCredentials: true
        });
        return response.data;
    },

    // Cập nhật attribute value
    updateAttributeValue: async (valueId, valueData) => {
        const response = await api.put(`/attribute-values/${valueId}`, valueData, {
            withCredentials: true
        });
        return response.data;
    },

    // Xóa attribute value
    deleteAttributeValue: async (valueId) => {
        const response = await api.delete(`/attribute-values/${valueId}`, {
            withCredentials: true
        });
        return response.data;
    }
};