import { adminApi } from '@/lib/axios';

export const orderItemService = {
    // Táº¡o order item má»›i
    createOrderItem: async (data) => {
        const response = await adminApi.post('/order-items', data);
        return response.data;
    },

    // Láº¥y sáº£n pháº©m bÃ¡n cháº¡y nháº¥t
    getBestSellers: async (params = {}) => {
        const response = await adminApi.get('/order-items/best-sellers', { params });
        return response.data;
    },

    // Láº¥y thá»‘ng kÃª doanh thu theo sáº£n pháº©m
    getRevenueByProduct: async (params = {}) => {
        const response = await adminApi.get('/order-items/revenue', { params });
        return response.data;
    },

    // Kiá»ƒm tra sáº£n pháº©m Ä‘Ã£ Ä‘Æ°á»£c mua bá»Ÿi user chÆ°a
    checkPurchased: async (userId, variantId) => {
        const response = await adminApi.get(`/order-items/user/${userId}/variant/${variantId}/purchased`);
        return response.data;
    },

    // Láº¥y danh sÃ¡ch sáº£n pháº©m user Ä‘Ã£ mua
    getUserPurchasedProducts: async (userId, params = {}) => {
        const response = await adminApi.get(`/order-items/user/${userId}/purchased-products`, { params });
        return response.data;
    },

    // Láº¥y order item theo ID
    getOrderItemById: async (itemId) => {
        const response = await adminApi.get(`/order-items/${itemId}`);
        return response.data;
    },

    // Láº¥y táº¥t cáº£ items cá»§a má»™t Ä‘Æ¡n hÃ ng
    getOrderItems: async (orderId) => {
        const response = await adminApi.get(`/order-items/order/${orderId}`);
        return response.data;
    },

    // TÃ­nh tá»•ng giÃ¡ trá»‹ Ä‘Æ¡n hÃ ng
    calculateOrderTotal: async (orderId) => {
        const response = await adminApi.get(`/order-items/order/${orderId}/total`);
        return response.data;
    },

    // Láº¥y items theo variant ID (lá»‹ch sá»­ mua hÃ ng)
    getOrderItemsByVariant: async (variantId, params = {}) => {
        const response = await adminApi.get(`/order-items/variant/${variantId}`, { params });
        return response.data;
    },

    // Cáº­p nháº­t order item
    updateOrderItem: async (itemId, data) => {
        const response = await adminApi.put(`/order-items/${itemId}`, data);
        return response.data;
    },

    // XÃ³a order item
    deleteOrderItem: async (itemId) => {
        const response = await adminApi.delete(`/order-items/${itemId}`);
        return response.data;
    },

    // XÃ³a táº¥t cáº£ items cá»§a má»™t Ä‘Æ¡n hÃ ng
    deleteOrderItems: async (orderId) => {
        const response = await adminApi.delete(`/order-items/order/${orderId}`);
        return response.data;
    }
};
