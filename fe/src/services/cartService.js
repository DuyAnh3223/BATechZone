import api from '@/lib/axios';

export const cartService = {
    // Lấy hoặc tạo giỏ hàng
    getOrCreateCart: async (data) => {
        const response = await api.post('/carts/get-or-create', data);
        return response.data;
    },

    // Lấy giỏ hàng theo ID
    getCartById: async (cartId) => {
        const response = await api.get(`/carts/${cartId}`);
        return response.data;
    },

    // Lấy giỏ hàng theo user ID
    getCartByUserId: async (userId) => {
        const response = await api.get(`/carts/user/${userId}`);
        return response.data;
    },

    // Lấy giỏ hàng theo session ID
    getCartBySessionId: async (sessionId) => {
        const response = await api.get(`/carts/session/${sessionId}`);
        return response.data;
    },

    // Lấy giỏ hàng với đầy đủ thông tin items
    getCartWithItems: async (cartId) => {
        const response = await api.get(`/carts/${cartId}/items`);
        return response.data;
    },

    // Gán giỏ hàng guest cho user khi đăng nhập
    assignCartToUser: async (data) => {
        const response = await api.post('/carts/assign-to-user', data);
        return response.data;
    },

    // Cập nhật thời gian hết hạn
    updateCartExpiry: async (cartId, expiresAt) => {
        const response = await api.put(`/carts/${cartId}/expiry`, { expiresAt });
        return response.data;
    },

    // Xóa giỏ hàng
    deleteCart: async (cartId) => {
        const response = await api.delete(`/carts/${cartId}`);
        return response.data;
    },

    // Xóa giỏ hàng đã hết hạn
    deleteExpiredCarts: async () => {
        const response = await api.delete('/carts/cleanup/expired');
        return response.data;
    },

    // Làm trống giỏ hàng
    clearCart: async (cartId) => {
        const response = await api.delete(`/carts/${cartId}/clear`);
        return response.data;
    },

    // Tính tổng giá trị giỏ hàng
    calculateCartTotal: async (cartId) => {
        const response = await api.get(`/carts/${cartId}/total`);
        return response.data;
    },

    // Kiểm tra tồn kho
    checkCartStock: async (cartId) => {
        const response = await api.get(`/carts/${cartId}/stock-check`);
        return response.data;
    }
};