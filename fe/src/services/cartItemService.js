import api from '@/lib/axios';

export const cartItemService = {
    // Thêm sản phẩm vào giỏ hàng
    addToCart: async (data) => {
        const response = await api.post('/cart-items/add', data);
        return response.data;
    },

    // Bulk add items
    bulkAddToCart: async (data) => {
        const response = await api.post('/cart-items/bulk-add', data);
        return response.data;
    },

    // Chuyển items giữa các cart
    transferCartItems: async (data) => {
        const response = await api.post('/cart-items/transfer', data);
        return response.data;
    },

    // Lấy item theo ID
    getCartItemById: async (itemId) => {
        const response = await api.get(`/cart-items/${itemId}`);
        return response.data;
    },

    // Lấy tất cả items trong giỏ hàng
    getCartItems: async (cartId) => {
        const response = await api.get(`/cart-items/cart/${cartId}`);
        return response.data;
    },

    // Lấy items cho checkout
    getCartItemsForCheckout: async (cartId) => {
        const response = await api.get(`/cart-items/cart/${cartId}/checkout`);
        return response.data;
    },

    // Kiểm tra item có trong giỏ không
    checkCartItemExists: async (cartId, variantId) => {
        const response = await api.get(`/cart-items/cart/${cartId}/variant/${variantId}/exists`);
        return response.data;
    },

    // Lấy số lượng của variant trong giỏ
    getCartItemQuantity: async (cartId, variantId) => {
        const response = await api.get(`/cart-items/cart/${cartId}/variant/${variantId}/quantity`);
        return response.data;
    },

    // Đếm số lượng items trong giỏ
    countCartItems: async (cartId) => {
        const response = await api.get(`/cart-items/cart/${cartId}/count`);
        return response.data;
    },

    // Cập nhật số lượng
    updateCartItemQuantity: async (itemId, quantity) => {
        const response = await api.put(`/cart-items/${itemId}/quantity`, { quantity });
        return response.data;
    },

    // Tăng số lượng
    incrementCartItem: async (itemId, amount) => {
        const response = await api.patch(`/cart-items/${itemId}/increment`, { amount });
        return response.data;
    },

    // Giảm số lượng
    decrementCartItem: async (itemId, amount) => {
        const response = await api.patch(`/cart-items/${itemId}/decrement`, { amount });
        return response.data;
    },

    // Xóa item khỏi giỏ hàng
    removeCartItem: async (itemId) => {
        const response = await api.delete(`/cart-items/${itemId}`);
        return response.data;
    },

    // Xóa item theo variant và cart
    removeCartItemByVariant: async (cartId, variantId) => {
        const response = await api.delete(`/cart-items/cart/${cartId}/variant/${variantId}`);
        return response.data;
    },

    // Xóa các item không hợp lệ
    removeInvalidCartItems: async (cartId) => {
        const response = await api.delete(`/cart-items/cart/${cartId}/invalid`);
        return response.data;
    },

    // Điều chỉnh số lượng về tồn kho
    adjustCartItemsToStock: async (cartId) => {
        const response = await api.patch(`/cart-items/cart/${cartId}/adjust-stock`);
        return response.data;
    }
};