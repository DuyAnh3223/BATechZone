import { userApi } from '@/lib/axios';

export const cartItemService = {
    // ThÃªm sáº£n pháº©m vÃ o giá» hÃ ng
    addToCart: async (data) => {
        const response = await userApi.post('/cart-items/add', data);
        return response.data;
    },

    // Bulk add items
    bulkAddToCart: async (data) => {
        const response = await userApi.post('/cart-items/bulk-add', data);
        return response.data;
    },

    // Chuyá»ƒn items giá»¯a cÃ¡c cart
    transferCartItems: async (data) => {
        const response = await userApi.post('/cart-items/transfer', data);
        return response.data;
    },

    // Láº¥y item theo ID
    getCartItemById: async (itemId) => {
        const response = await userApi.get(`/cart-items/${itemId}`);
        return response.data;
    },

    // Láº¥y táº¥t cáº£ items trong giá» hÃ ng
    getCartItems: async (cartId) => {
        const response = await userApi.get(`/cart-items/cart/${cartId}`);
        return response.data;
    },

    // Láº¥y items cho checkout
    getCartItemsForCheckout: async (cartId) => {
        const response = await userApi.get(`/cart-items/cart/${cartId}/checkout`);
        return response.data;
    },

    // Kiá»ƒm tra item cÃ³ trong giá» khÃ´ng
    checkCartItemExists: async (cartId, variantId) => {
        const response = await userApi.get(`/cart-items/cart/${cartId}/variant/${variantId}/exists`);
        return response.data;
    },

    // Láº¥y sá»‘ lÆ°á»£ng cá»§a variant trong giá»
    getCartItemQuantity: async (cartId, variantId) => {
        const response = await userApi.get(`/cart-items/cart/${cartId}/variant/${variantId}/quantity`);
        return response.data;
    },

    // Äáº¿m sá»‘ lÆ°á»£ng items trong giá»
    countCartItems: async (cartId) => {
        const response = await userApi.get(`/cart-items/cart/${cartId}/count`);
        return response.data;
    },

    // Cáº­p nháº­t sá»‘ lÆ°á»£ng
    updateCartItemQuantity: async (itemId, quantity) => {
        const response = await userApi.put(`/cart-items/${itemId}/quantity`, { quantity });
        return response.data;
    },

    // TÄƒng sá»‘ lÆ°á»£ng
    incrementCartItem: async (itemId, amount) => {
        const response = await userApi.patch(`/cart-items/${itemId}/increment`, { amount });
        return response.data;
    },

    // Giáº£m sá»‘ lÆ°á»£ng
    decrementCartItem: async (itemId, amount) => {
        const response = await userApi.patch(`/cart-items/${itemId}/decrement`, { amount });
        return response.data;
    },

    // XÃ³a item khá»i giá» hÃ ng
    removeCartItem: async (itemId) => {
        const response = await userApi.delete(`/cart-items/${itemId}`);
        return response.data;
    },

    // XÃ³a item theo variant vÃ  cart
    removeCartItemByVariant: async (cartId, variantId) => {
        const response = await userApi.delete(`/cart-items/cart/${cartId}/variant/${variantId}`);
        return response.data;
    },

    // XÃ³a cÃ¡c item khÃ´ng há»£p lá»‡
    removeInvalidCartItems: async (cartId) => {
        const response = await userApi.delete(`/cart-items/cart/${cartId}/invalid`);
        return response.data;
    },

    // Äiá»u chá»‰nh sá»‘ lÆ°á»£ng vá» tá»“n kho
    adjustCartItemsToStock: async (cartId) => {
        const response = await userApi.patch(`/cart-items/cart/${cartId}/adjust-stock`);
        return response.data;
    }
};
