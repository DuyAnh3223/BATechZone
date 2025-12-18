import { adminApi } from '@/lib/axios';

export const attributeService = {
    // Láº¥y danh sÃ¡ch attributes
    listAttributes: async (params = {}) => {
        const response = await adminApi.get('/attributes', { 
            params,
            withCredentials: true 
        });
        return response.data;
    },

    // Láº¥y attribute theo ID
    getAttribute: async (attributeId) => {
        const response = await adminApi.get(`/attributes/${attributeId}`, {
            withCredentials: true
        });
        return response.data;
    },

    // Táº¡o attribute má»›i
    createAttribute: async (attributeData) => {
        const response = await adminApi.post('/attributes', attributeData, {
            withCredentials: true
        });
        return response.data;
    },

    // Cáº­p nháº­t attribute
    updateAttribute: async (attributeId, attributeData) => {
        const response = await adminApi.put(`/attributes/${attributeId}`, attributeData, {
            withCredentials: true
        });
        return response.data;
    },

    // XÃ³a attribute
    deleteAttribute: async (attributeId) => {
        const response = await adminApi.delete(`/attributes/${attributeId}`, {
            withCredentials: true
        });
        return response.data;
    },

    // Láº¥y attributes theo category
    getAttributesByCategory: async (categoryId) => {
        const response = await adminApi.get('/attributes', {
            params: { category_id: categoryId },
            withCredentials: true
        });
        return response.data;
    },

    // Láº¥y categories cá»§a attribute
    getAttributeCategories: async (attributeId) => {
        const response = await adminApi.get(`/attributes/${attributeId}/categories`, {
            withCredentials: true
        });
        return response.data;
    },

    // Cáº­p nháº­t categories cho attribute
    updateAttributeCategories: async (attributeId, categoryIds) => {
        const response = await adminApi.put(`/attributes/${attributeId}/categories`, {
            category_ids: categoryIds
        }, {
            withCredentials: true
        });
        return response.data;
    },

    // XÃ³a má»™t category khá»i attribute
    removeAttributeCategory: async (attributeId, categoryId) => {
        const response = await adminApi.delete(`/attributes/${attributeId}/categories/${categoryId}`, {
            withCredentials: true
        });
        return response.data;
    }
};
