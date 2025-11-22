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
        const response = await api.get(`/variant-images/variants/${variantId}/images`, { withCredentials: true });
        return response.data;
    },

    // Thêm image cho variant
    addVariantImage: async (variantId, data) => {
        const response = await api.post(`/variant-images/variants/${variantId}/images`, data, { withCredentials: true });
        return response.data;
    },

    // Upload nhiều images cho variant
    uploadVariantImages: async (variantId, formData) => {
        const response = await api.post(`/variant-images/variants/${variantId}/images/bulk`, formData, {
            withCredentials: true,
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // Xóa image
    deleteImage: async (imageId) => {
        const response = await api.delete(`/variant-images/images/${imageId}`, { withCredentials: true });
        return response.data;
    },

    // Lấy attribute values theo product category
    getAttributeValuesByProduct: async (productId) => {
        const response = await api.get(`/products/${productId}/attribute-values`, { withCredentials: true });
        return response.data;
    },

    // Lấy ảnh primary của variant đầu tiên của product
    getFirstVariantPrimaryImage: async (productId) => {
        try {
            // Lấy variants của product
            const variantsResponse = await api.get(`/products/${productId}/variants`, { withCredentials: true });
            let variants = variantsResponse.data;
            
            // Handle different response formats
            if (variants && variants.data && Array.isArray(variants.data)) {
                variants = variants.data;
            } else if (!Array.isArray(variants)) {
                return null;
            }
            
            if (!variants || variants.length === 0) {
                return null;
            }
            
            // Lấy variant đầu tiên
            const firstVariant = variants[0];
            
            if (!firstVariant || !firstVariant.variant_id) {
                return null;
            }
            
            // Lấy images của variant đầu tiên
            const imagesResponse = await api.get(`/variant-images/variants/${firstVariant.variant_id}/images`, { 
                withCredentials: true 
            });
            let images = imagesResponse.data || [];
            
            // Handle different response formats
            if (images && images.data && Array.isArray(images.data)) {
                images = images.data;
            }
            
            // Lấy ảnh primary
            const primaryImage = images.find(img => img.is_primary);
            
            return primaryImage || (images.length > 0 ? images[0] : null);
        } catch (error) {
            console.error('Error getting first variant primary image:', error);
            return null;
        }
    }
};