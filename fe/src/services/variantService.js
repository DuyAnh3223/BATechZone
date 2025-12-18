import { adminApi } from '@/lib/axios';

export const variantService = {
    // Láº¥y danh sÃ¡ch variants
    listVariants: async (params = {}) => {
        const response = await adminApi.get('/variants', { params, withCredentials: true });
        return response.data;
    },

    // Láº¥y variant theo ID
    getVariant: async (variantId) => {
        const response = await adminApi.get(`/variants/${variantId}`, { withCredentials: true });
        return response.data;
    },

    // Láº¥y variants theo product ID
    getVariantsByProductId: async (productId) => {
        const response = await adminApi.get(`/products/${productId}/variants`, { withCredentials: true });
        return response.data;
    },

    // Táº¡o variant má»›i
    createVariant: async (data) => {
        const response = await adminApi.post('/variants', data, { withCredentials: true });
        return response.data;
    },

    // Táº¡o variant cho product
    createVariantForProduct: async (productId, data) => {
        const response = await adminApi.post(`/products/${productId}/variants`, data, { withCredentials: true });
        return response.data;
    },

    // Cáº­p nháº­t variant
    updateVariant: async (variantId, data) => {
        const response = await adminApi.put(`/variants/${variantId}`, data, { withCredentials: true });
        return response.data;
    },

    // XÃ³a variant
    deleteVariant: async (variantId) => {
        const response = await adminApi.delete(`/variants/${variantId}`, { withCredentials: true });
        return response.data;
    },

    // Láº¥y attributes theo product ID
    getAttributesByProductId: async (productId) => {
        const response = await adminApi.get(`/products/${productId}/attributes`, { withCredentials: true });
        return response.data;
    },

    // Láº¥y mappings theo product ID
    getMappingsByProductId: async (productId) => {
        const response = await adminApi.get(`/products/${productId}/variant-mappings`, { withCredentials: true });
        return response.data;
    },

    // Cáº­p nháº­t variant mappings
    updateVariantMappings: async (variantId, attributeIds) => {
        const response = await adminApi.put(`/variants/${variantId}/mappings`, { attributeIds }, { withCredentials: true });
        return response.data;
    },

    // Láº¥y images theo variant ID
    getVariantImages: async (variantId) => {
        const response = await adminApi.get(`/variant-images/variants/${variantId}/images`, { withCredentials: true });
        return response.data;
    },

    // ThÃªm image cho variant
    addVariantImage: async (variantId, data) => {
        const response = await adminApi.post(`/variant-images/variants/${variantId}/images`, data, { withCredentials: true });
        return response.data;
    },

    // Upload nhiá»u images cho variant
    uploadVariantImages: async (variantId, formData) => {
        const response = await adminApi.post(`/variant-images/variants/${variantId}/images/bulk`, formData, {
            withCredentials: true,
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // XÃ³a image
    deleteImage: async (imageId) => {
        const response = await adminApi.delete(`/variant-images/images/${imageId}`, { withCredentials: true });
        return response.data;
    },

    // Láº¥y attribute values theo product category
    getAttributeValuesByProduct: async (productId) => {
        const response = await adminApi.get(`/products/${productId}/attribute-values`, { withCredentials: true });
        return response.data;
    },

    // Láº¥y áº£nh primary cá»§a variant Ä‘áº§u tiÃªn cá»§a product
    getFirstVariantPrimaryImage: async (productId) => {
        try {
            // Láº¥y variants cá»§a product
            const variantsResponse = await adminApi.get(`/products/${productId}/variants`, { withCredentials: true });
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
            
            // Láº¥y variant Ä‘áº§u tiÃªn
            const firstVariant = variants[0];
            
            if (!firstVariant || !firstVariant.variant_id) {
                return null;
            }
            
            // Láº¥y images cá»§a variant Ä‘áº§u tiÃªn
            const imagesResponse = await adminApi.get(`/variant-images/variants/${firstVariant.variant_id}/images`, { 
                withCredentials: true 
            });
            let images = imagesResponse.data || [];
            
            // Handle different response formats
            if (images && images.data && Array.isArray(images.data)) {
                images = images.data;
            }
            
            // Láº¥y áº£nh primary
            const primaryImage = images.find(img => img.is_primary);
            
            return primaryImage || (images.length > 0 ? images[0] : null);
        } catch (error) {
            console.error('Error getting first variant primary image:', error);
            return null;
        }
    }
};
