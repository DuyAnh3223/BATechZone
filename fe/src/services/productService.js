import api, { adminApi } from '@/lib/axios';

export const productService = {
    // Lấy danh sách products (public - no auth needed)
    listProducts: async (params = {}) => {
        const response = await api.get('/products', { 
            params,
            withCredentials: true 
        });
        return response.data;
    },

    // Lấy product theo ID (public - no auth needed)
    getProduct: async (productId) => {
        const response = await api.get(`/products/${productId}`, {
            withCredentials: true
        });
        return response.data;
    },

    // Tạo product mới (admin only)
    createProduct: async (data) => {
        const response = await adminApi.post('/products', data, {
            withCredentials: true
        });
        return response.data;
    },

    // Cập nhật product (admin only)
    updateProduct: async (productId, data) => {
        const response = await adminApi.put(`/products/${productId}`, data, {
            withCredentials: true
        });
        return response.data;
    },

    // Xóa product (admin only)
    deleteProduct: async (productId) => {
        const response = await adminApi.delete(`/products/${productId}`, {
            withCredentials: true
        });
        return response.data;
    },

    // Tăng lượt xem product (public - no auth)
    increaseProductView: async (productId) => {
        const response = await api.put(`/products/${productId}/view`, {}, {
            withCredentials: true
        });
        return response.data;
    },

    // Lấy products cho Build PC theo category (public - no auth)
    getProductsForBuildPC: async (categoryId) => {
        const response = await api.get('/products/build-pc', {
            params: { category_id: categoryId },
            withCredentials: true
        });
        return response.data;
    },

    // Lấy filter options cho một category (public - no auth)
    getFilterOptions: async (categoryId) => {
        const response = await api.get('/products/filters/options', {
            params: { category_id: categoryId },
            withCredentials: true
        });
        return response.data;
    }
};