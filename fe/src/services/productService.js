import api from '@/lib/axios';

export const productService = {
    // Lấy danh sách products
    listProducts: async (params = {}) => {
        const response = await api.get('/products', { 
            params,
            withCredentials: true 
        });
        return response.data;
    },

    // Lấy product theo ID
    getProduct: async (productId) => {
        const response = await api.get(`/products/${productId}`, {
            withCredentials: true
        });
        return response.data;
    },

    // Tạo product mới
    createProduct: async (data) => {
        const response = await api.post('/products', data, {
            withCredentials: true
        });
        return response.data;
    },

    // Cập nhật product
    updateProduct: async (productId, data) => {
        const response = await api.put(`/products/${productId}`, data, {
            withCredentials: true
        });
        return response.data;
    },

    // Xóa product
    deleteProduct: async (productId) => {
        const response = await api.delete(`/products/${productId}`, {
            withCredentials: true
        });
        return response.data;
    },

    // Tăng lượt xem product
    increaseProductView: async (productId) => {
        const response = await api.put(`/products/${productId}/view`, {}, {
            withCredentials: true
        });
        return response.data;
    }
};