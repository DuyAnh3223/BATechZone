import { adminApi } from '@/lib/axios';

export const attributeValueService = {
    // Láº¥y danh sÃ¡ch táº¥t cáº£ attribute values
    listAttributeValues: async (params = {}) => {
        const response = await adminApi.get('/attribute-values', { 
            params,
            withCredentials: true 
        });
        return response.data;
    },

    // Láº¥y cÃ¡c values cá»§a má»™t attribute cá»¥ thá»ƒ (cÃ³ phÃ¢n trang)
    getAttributeValues: async (attributeId, params = {}) => {
        const response = await adminApi.get(`/attribute-values/${attributeId}/values`, {
            params,
            withCredentials: true
        });
        return response.data;
    },

    // Táº¡o attribute value má»›i
    createAttributeValue: async (valueData) => {
        const response = await adminApi.post('/attribute-values', valueData, {
            withCredentials: true
        });
        return response.data;
    },

    // Cáº­p nháº­t attribute value
    updateAttributeValue: async (valueId, valueData) => {
        const response = await adminApi.put(`/attribute-values/${valueId}`, valueData, {
            withCredentials: true
        });
        return response.data;
    },

    // XÃ³a attribute value
    deleteAttributeValue: async (valueId) => {
        const response = await adminApi.delete(`/attribute-values/${valueId}`, {
            withCredentials: true
        });
        return response.data;
    }
};
