import api from '@/lib/axios';

export const variantImageService = {
    // Lấy tất cả images của variant
    getVariantImages: async (variantId) => {
        const response = await api.get(`/variant-images/variants/${variantId}/images`, {
            withCredentials: true
        });
        return response.data;
    },

    // Lấy primary image của variant
    getPrimaryImage: async (variantId) => {
        const response = await api.get(`/variant-images/variants/${variantId}/images/primary`, {
            withCredentials: true
        });
        return response.data;
    },

    // Upload single image cho variant
    uploadVariantImage: async (variantId, formData) => {
        const response = await api.post(
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
        const response = await api.post(
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

    // Set image làm primary
    setPrimaryImage: async (imageId) => {
        const response = await api.patch(
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
        const response = await api.patch(
            `/variant-images/images/${imageId}`,
            data,
            {
                withCredentials: true
            }
        );
        return response.data;
    },

    // Xóa image
    deleteVariantImage: async (imageId) => {
        const response = await api.delete(`/variant-images/images/${imageId}`, {
            withCredentials: true
        });
        return response.data;
    }
};
