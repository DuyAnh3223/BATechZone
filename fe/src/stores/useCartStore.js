import { create } from 'zustand';
import { cartService } from '@/services/cartService';

export const useCartStore = create((set) => ({
    cart: null,
    cartTotal: null,
    stockCheck: null,
    loading: false,
    error: null,

    // Lấy hoặc tạo giỏ hàng
    getOrCreateCart: async (data) => {
        set({ loading: true, error: null });
        try {
            const response = await cartService.getOrCreateCart(data);
            set({ cart: response.data || response, loading: false });
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Lấy giỏ hàng theo ID
    fetchCartById: async (cartId) => {
        set({ loading: true, error: null });
        try {
            const response = await cartService.getCartById(cartId);
            set({ cart: response.data || response, loading: false });
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Lấy giỏ hàng theo user ID
    fetchCartByUserId: async (userId) => {
        set({ loading: true, error: null });
        try {
            const response = await cartService.getCartByUserId(userId);
            set({ cart: response.data || response, loading: false });
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Lấy giỏ hàng theo session ID
    fetchCartBySessionId: async (sessionId) => {
        set({ loading: true, error: null });
        try {
            const response = await cartService.getCartBySessionId(sessionId);
            set({ cart: response.data || response, loading: false });
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Lấy giỏ hàng với đầy đủ items
    fetchCartWithItems: async (cartId) => {
        set({ loading: true, error: null });
        try {
            const response = await cartService.getCartWithItems(cartId);
            set({ cart: response.data || response, loading: false });
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Gán giỏ hàng guest cho user
    assignCartToUser: async (data) => {
        set({ loading: true, error: null });
        try {
            const response = await cartService.assignCartToUser(data);
            set({ loading: false });
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Xóa giỏ hàng
    deleteCart: async (cartId) => {
        set({ loading: true, error: null });
        try {
            const response = await cartService.deleteCart(cartId);
            set({ cart: null, loading: false });
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Làm trống giỏ hàng
    clearCart: async (cartId) => {
        set({ loading: true, error: null });
        try {
            const response = await cartService.clearCart(cartId);
            set({ loading: false });
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Tính tổng giá trị giỏ hàng
    calculateTotal: async (cartId) => {
        set({ loading: true, error: null });
        try {
            const response = await cartService.calculateCartTotal(cartId);
            set({ cartTotal: response.data || response, loading: false });
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Kiểm tra tồn kho
    checkStock: async (cartId) => {
        set({ loading: true, error: null });
        try {
            const response = await cartService.checkCartStock(cartId);
            set({ stockCheck: response.data || response, loading: false });
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
        cart: null, 
        cartTotal: null, 
        stockCheck: null, 
        loading: false, 
        error: null 
    })
}));