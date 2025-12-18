import { userApi } from '@/lib/axios';

export const cartService = {
    // Láº¥y hoáº·c táº¡o giá» hÃ ng
    getOrCreateCart: async (data) => {
        const response = await userApi.post('/carts/get-or-create', data);
        return response.data;
    },

    // Láº¥y giá» hÃ ng theo ID
    getCartById: async (cartId) => {
        const response = await userApi.get(`/carts/${cartId}`);
        return response.data;
    },

    // Láº¥y giá» hÃ ng theo user ID
    getCartByUserId: async (userId) => {
        const response = await userApi.get(`/carts/user/${userId}`);
        return response.data;
    },

    // Láº¥y giá» hÃ ng theo session ID
    getCartBySessionId: async (sessionId) => {
        const response = await userApi.get(`/carts/session/${sessionId}`);
        return response.data;
    },

    // Láº¥y giá» hÃ ng vá»›i Ä‘áº§y Ä‘á»§ thÃ´ng tin items
    getCartWithItems: async (cartId) => {
        const response = await userApi.get(`/carts/${cartId}/items`);
        return response.data;
    },

    // GÃ¡n giá» hÃ ng guest cho user khi Ä‘Äƒng nháº­p
    assignCartToUser: async (data) => {
        const response = await userApi.post('/carts/assign-to-user', data);
        return response.data;
    },

    // Cáº­p nháº­t thá»i gian háº¿t háº¡n
    updateCartExpiry: async (cartId, expiresAt) => {
        const response = await userApi.put(`/carts/${cartId}/expiry`, { expiresAt });
        return response.data;
    },

    // XÃ³a giá» hÃ ng
    deleteCart: async (cartId) => {
        const response = await userApi.delete(`/carts/${cartId}`);
        return response.data;
    },

    // XÃ³a giá» hÃ ng Ä‘Ã£ háº¿t háº¡n
    deleteExpiredCarts: async () => {
        const response = await userApi.delete('/carts/cleanup/expired');
        return response.data;
    },

    // LÃ m trá»‘ng giá» hÃ ng
    clearCart: async (cartId) => {
        const response = await userApi.delete(`/carts/${cartId}/clear`);
        return response.data;
    },

    // TÃ­nh tá»•ng giÃ¡ trá»‹ giá» hÃ ng
    calculateCartTotal: async (cartId) => {
        const response = await userApi.get(`/carts/${cartId}/total`);
        return response.data;
    },

    // Kiá»ƒm tra tá»“n kho
    checkCartStock: async (cartId) => {
        const response = await userApi.get(`/carts/${cartId}/stock-check`);
        return response.data;
    }
};
