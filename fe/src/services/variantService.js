import api from '@/lib/axios';

export const variantService = {
    // Lấy danh sách variants
    listVariants: async (params = {}) => {
        const response = await api.get('/variants', { params, withCredentials: true });
        return response.data;
    },

    // Lấy variant theo ID
    getVariant: async (variantId) => {
        const response = await api.get(`/variants/${variantId}`, { withCredentials: true });
        return response.data;
    },

    // Lấy variants theo product ID
    getVariantsByProductId: async (productId) => {
        const response = await api.get(`/products/${productId}/variants`, { withCredentials: true });
        return response.data;
    },

    // Tạo variant mới
    createVariant: async (data) => {
        const response = await api.post('/variants', data, { withCredentials: true });
        return response.data;
    },

    // Tạo variant cho product
    createVariantForProduct: async (productId, data) => {
        const response = await api.post(`/products/${productId}/variants`, data, { withCredentials: true });
        return response.data;
    },

    // Cập nhật variant
    updateVariant: async (variantId, data) => {
        const response = await api.put(`/variants/${variantId}`, data, { withCredentials: true });
        return response.data;
    },

    // Xóa variant
    deleteVariant: async (variantId) => {
        const response = await api.delete(`/variants/${variantId}`, { withCredentials: true });
        return response.data;
    },

    // Lấy attributes theo product ID
    getAttributesByProductId: async (productId) => {
        const response = await api.get(`/products/${productId}/attributes`, { withCredentials: true });
        return response.data;
    },

    // Lấy mappings theo product ID
    getMappingsByProductId: async (productId) => {
        const response = await api.get(`/products/${productId}/variant-mappings`, { withCredentials: true });
        return response.data;
    },

    // Cập nhật variant mappings
    updateVariantMappings: async (variantId, attributeIds) => {
        const response = await api.put(`/variants/${variantId}/mappings`, { attributeIds }, { withCredentials: true });
        return response.data;
    },

    // Lấy images theo variant ID
    getVariantImages: async (variantId) => {
        const response = await api.get(`/variants/${variantId}/images`, { withCredentials: true });
        return response.data;
    },

    // Thêm image cho variant
    addVariantImage: async (variantId, data) => {
        const response = await api.post(`/variants/${variantId}/images`, data, { withCredentials: true });
        return response.data;
    },

    // Upload nhiều images cho variant
    uploadVariantImages: async (variantId, formData) => {
        const response = await api.post(`/variants/${variantId}/images/upload-multiple`, formData, {
            withCredentials: true,
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // Xóa image
    deleteImage: async (imageId) => {
        const response = await api.delete(`/images/${imageId}`, { withCredentials: true });
        return response.data;
    },

    // Lấy attribute values theo product category
    getAttributeValuesByProduct: async (productId) => {
        const response = await api.get(`/products/${productId}/attribute-values`, { withCredentials: true });
        return response.data;
    }
};