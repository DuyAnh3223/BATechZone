import api, { adminApi } from '@/lib/axios';

export const bundleService = {
    // ==================== USER APIs (Public) ====================
    
    /**
     * Lấy danh sách bundles (User - Public)
     * @param {Object} params - Query parameters
     * @returns {Promise<{success: boolean, data: Array, pagination: Object}>}
     */
    listBundles: async (params = {}) => {
        const response = await api.get('/bundles', { 
            params,
            withCredentials: true 
        });
        return response.data;
    },

    /**
     * Lấy chi tiết bundle (User - Public)
     * @param {number} variantId - Bundle variant ID
     * @returns {Promise<{success: boolean, data: Object}>}
     */
    getBundle: async (variantId) => {
        const response = await api.get(`/bundles/${variantId}`, {
            withCredentials: true
        });
        return response.data;
    },

    /**
     * Kiểm tra tồn kho bundle (User - Public)
     * @param {number} variantId - Bundle variant ID
     * @returns {Promise<{success: boolean, data: {variant_id, available_stock, in_stock}}>}
     */
    checkStock: async (variantId) => {
        const response = await api.get(`/bundles/${variantId}/stock`, {
            withCredentials: true
        });
        return response.data;
    },

    // ==================== ADMIN APIs (Protected) ====================
    
    /**
     * Lấy danh sách bundles (Admin)
     * @param {Object} params - Query parameters
     * @returns {Promise<{success: boolean, data: Array, pagination: Object}>}
     */
    listAdminBundles: async (params = {}) => {
        const response = await adminApi.get('/bundles', { 
            params,
            withCredentials: true 
        });
        return response.data;
    },

    /**
     * Lấy chi tiết bundle (Admin)
     * @param {number} variantId - Bundle variant ID
     * @returns {Promise<{success: boolean, data: Object}>}
     */
    getAdminBundle: async (variantId) => {
        const response = await adminApi.get(`/bundles/${variantId}`, {
            withCredentials: true
        });
        return response.data;
    },

    /**
     * Tạo bundle mới (Admin)
     * @param {Object} bundleData - Bundle data
     * @returns {Promise<{success: boolean, message: string, data: Object}>}
     */
    createBundle: async (bundleData) => {
        const response = await adminApi.post('/bundles', bundleData, {
            withCredentials: true
        });
        return response.data;
    },

    /**
     * Cập nhật bundle (Admin)
     * @param {number} variantId - Bundle variant ID
     * @param {Object} bundleData - Bundle data to update
     * @returns {Promise<{success: boolean, message: string, data: Object}>}
     */
    updateBundle: async (variantId, bundleData) => {
        const response = await adminApi.put(`/bundles/${variantId}`, bundleData, {
            withCredentials: true
        });
        return response.data;
    },

    /**
     * Xóa bundle (Admin - Soft delete)
     * @param {number} variantId - Bundle variant ID
     * @returns {Promise<{success: boolean, message: string}>}
     */
    deleteBundle: async (variantId) => {
        const response = await adminApi.delete(`/bundles/${variantId}`, {
            withCredentials: true
        });
        return response.data;
    }
};
