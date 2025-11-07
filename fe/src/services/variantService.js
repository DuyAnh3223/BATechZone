import api from '@/lib/axios';

export const variantService = {
    // Lấy danh sách variants
    listVariants: async (params = {}) => {
        const response = await api.get('/variants', { params });
        return response.data;
    },

    // Lấy variant theo ID
    getVariant: async (variantId) => {
        const response = await api.get(`/variants/${variantId}`);
        return response.data;
    },

    // Tạo variant mới
    createVariant: async (data) => {
        const response = await api.post('/variants', data);
        return response.data;
    },

    // Cập nhật variant
    updateVariant: async (variantId, data) => {
        const response = await api.put(`/variants/${variantId}`, data);
        return response.data;
    },

    // Xóa variant
    deleteVariant: async (variantId) => {
        const response = await api.delete(`/variants/${variantId}`);
        return response.data;
    }
};