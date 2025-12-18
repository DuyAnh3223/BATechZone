import { adminApi } from '@/lib/axios';

export const variantImageService = {
    // Láº¥y táº¥t cáº£ images cá»§a variant
    getVariantImages: async (variantId) => {
        const response = await adminApi.get(`/variant-images/variants/${variantId}/images`, {
            withCredentials: true
        });
        return response.data;
    },

    // Láº¥y primary image cá»§a variant
    getPrimaryImage: async (variantId) => {
        const response = await adminApi.get(`/variant-images/variants/${variantId}/images/primary`, {
            withCredentials: true
        });
        return response.data;
    },

    // Upload single image cho variant
    uploadVariantImage: async (variantId, formData) => {
        const response = await adminApi.post(
            `/variant-images/variants/${variantId}/images`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            }
        );
        return response.data;
    },

    // Bulk upload images cho variant (max 10)
    bulkUploadImages: async (variantId, formData) => {
        const response = await adminApi.post(
            `/variant-images/variants/${variantId}/images/bulk`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            }
        );
        return response.data;
    },

    // Set image lÃ m primary
    setPrimaryImage: async (imageId) => {
        const response = await adminApi.patch(
            `/variant-images/images/${imageId}/set-primary`,
            {},
            {
                withCredentials: true
            }
        );
        return response.data;
    },

    // Update image metadata (alt_text, display_order)
    updateImageMetadata: async (imageId, data) => {
        const response = await adminApi.patch(
            `/variant-images/images/${imageId}`,
            data,
            {
                withCredentials: true
            }
        );
        return response.data;
    },

    // XÃ³a image
    deleteVariantImage: async (imageId) => {
        const response = await adminApi.delete(`/variant-images/images/${imageId}`, {
            withCredentials: true
        });
        return response.data;
    }
};

