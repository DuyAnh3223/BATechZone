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

    // Lấy attributes theo category
    getAttributesByCategory: async (categoryId) => {
        const response = await adminApi.get(`/categories/${categoryId}/attributes`, {
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
        return response.data;    },

    // Create attribute for specific category (creates attribute then assigns to category)
    createAttributeForCategory: async (categoryId, attributeData) => {
        // First create the attribute
        const createResponse = await adminApi.post('/attributes', {
            attribute_name: attributeData.attribute_name,
            category_ids: [categoryId],
            values: []
        }, {
            withCredentials: true
        });
        
        return createResponse.data;
    },

    // Update attribute category (e.g., toggle is_variant_attribute)
    // Note: Need categoryId and attributeId, not attributeCategoryId
    updateAttributeCategory: async (categoryId, attributeId, data) => {
        const response = await adminApi.patch(`/categories/${categoryId}/attributes/${attributeId}`, data, {
            withCredentials: true
        });
        return response.data;
    },

    // Remove attribute from category
    removeAttributeFromCategory: async (categoryId, attributeId) => {
        const response = await adminApi.delete(`/categories/${categoryId}/attributes/${attributeId}`, {
            withCredentials: true
        });
        return response.data;
    },

    // Get attribute values for a category attribute
    getAttributeValues: async (categoryId, attributeId) => {
        const response = await adminApi.get(`/categories/${categoryId}/attributes/${attributeId}/values`, {
            withCredentials: true
        });
        return response.data;
    },

    // Add attribute value
    addAttributeValue: async (categoryId, attributeId, valueData) => {
        const response = await adminApi.post(`/categories/${categoryId}/attributes/${attributeId}/values`, valueData, {
            withCredentials: true
        });
        return response.data;
    },

    // Remove attribute value
    removeAttributeValue: async (cavId) => {
        const response = await adminApi.delete(`/categories/values/${cavId}`, {
            withCredentials: true
        });
        return response.data;
    }
};
