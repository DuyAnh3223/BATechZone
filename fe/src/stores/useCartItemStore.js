import { create } from 'zustand';
import { cartItemService } from '@/services/cartItemService';

export const useCartItemStore = create((set) => ({
    cartItems: [],
    currentItem: null,
    checkoutItems: [],
    itemCount: 0,
    loading: false,
    error: null,

    // Thêm sản phẩm vào giỏ hàng
    addToCart: async (data) => {
        set({ loading: true, error: null });
        try {
            const response = await cartItemService.addToCart(data);
            // Tự động refresh cart items sau khi thêm thành công
            if (data.cartId) {
                try {
                    const itemsResponse = await cartItemService.getCartItems(data.cartId);
                    set({ 
                        cartItems: itemsResponse.data || itemsResponse, 
                        loading: false 
                    });
                } catch (fetchError) {
                    console.error('Error fetching cart items after add:', fetchError);
                    set({ loading: false });
                }
            } else {
                set({ loading: false });
            }
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Bulk add items
    bulkAddToCart: async (data) => {
        set({ loading: true, error: null });
        try {
            const response = await cartItemService.bulkAddToCart(data);
            // Tự động refresh cart items sau khi thêm thành công
            if (data.cartId) {
                try {
                    const itemsResponse = await cartItemService.getCartItems(data.cartId);
                    set({ 
                        cartItems: itemsResponse.data || itemsResponse, 
                        loading: false 
                    });
                } catch (fetchError) {
                    console.error('Error fetching cart items after bulk add:', fetchError);
                    set({ loading: false });
                }
            } else {
                set({ loading: false });
            }
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Lấy tất cả items trong giỏ hàng
    fetchCartItems: async (cartId) => {
        set({ loading: true, error: null });
        try {
            const response = await cartItemService.getCartItems(cartId);
            set({ cartItems: response.data || response, loading: false });
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Lấy items cho checkout
    fetchCartItemsForCheckout: async (cartId) => {
        set({ loading: true, error: null });
        try {
            const response = await cartItemService.getCartItemsForCheckout(cartId);
            set({ checkoutItems: response.data || response, loading: false });
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Đếm số lượng items
    countCartItems: async (cartId) => {
        try {
            const response = await cartItemService.countCartItems(cartId);
            set({ itemCount: response.data?.count || 0 });
            return response;
        } catch (error) {
            set({ error: error.message });
            throw error;
        }
    },

    // Cập nhật số lượng
    updateQuantity: async (itemId, quantity) => {
        set({ loading: true, error: null });
        try {
            const response = await cartItemService.updateCartItemQuantity(itemId, quantity);
            set({ loading: false });
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Tăng số lượng
    incrementItem: async (itemId, amount) => {
        set({ loading: true, error: null });
        try {
            const response = await cartItemService.incrementCartItem(itemId, amount);
            set({ loading: false });
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Giảm số lượng
    decrementItem: async (itemId, amount) => {
        set({ loading: true, error: null });
        try {
            const response = await cartItemService.decrementCartItem(itemId, amount);
            set({ loading: false });
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Xóa item
    removeItem: async (itemId) => {
        set({ loading: true, error: null });
        try {
            const response = await cartItemService.removeCartItem(itemId);
            set((state) => ({
                cartItems: state.cartItems.filter(item => item.cart_item_id !== itemId),
                loading: false
            }));
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Xóa các item không hợp lệ
    removeInvalidItems: async (cartId) => {
        set({ loading: true, error: null });
        try {
            const response = await cartItemService.removeInvalidCartItems(cartId);
            set({ loading: false });
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Điều chỉnh số lượng về tồn kho
    adjustToStock: async (cartId) => {
        set({ loading: true, error: null });
        try {
            const response = await cartItemService.adjustCartItemsToStock(cartId);
            set({ loading: false });
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Clear error
    clearError: () => set({ error: null }),

    // Reset state
    reset: () => set({ 
        cartItems: [], 
        currentItem: null, 
        checkoutItems: [], 
        itemCount: 0, 
        loading: false, 
        error: null 
    })
}));