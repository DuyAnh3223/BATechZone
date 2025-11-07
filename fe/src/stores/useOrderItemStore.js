import { create } from 'zustand';
import { orderItemService } from '@/services/orderItemService';

export const useOrderItemStore = create((set) => ({
    orderItems: [],
    currentItem: null,
    bestSellers: [],
    revenueData: null,
    purchasedProducts: [],
    loading: false,
    error: null,

    // Tạo order item mới
    createOrderItem: async (data) => {
        set({ loading: true, error: null });
        try {
            const response = await orderItemService.createOrderItem(data);
            set({ loading: false });
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Lấy sản phẩm bán chạy nhất
    fetchBestSellers: async (params) => {
        set({ loading: true, error: null });
        try {
            const response = await orderItemService.getBestSellers(params);
            set({ bestSellers: response.data || response, loading: false });
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Lấy thống kê doanh thu theo sản phẩm
    fetchRevenueByProduct: async (params) => {
        set({ loading: true, error: null });
        try {
            const response = await orderItemService.getRevenueByProduct(params);
            set({ revenueData: response, loading: false });
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Kiểm tra sản phẩm đã được mua bởi user chưa
    checkPurchased: async (userId, variantId) => {
        set({ loading: true, error: null });
        try {
            const response = await orderItemService.checkPurchased(userId, variantId);
            set({ loading: false });
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Lấy danh sách sản phẩm user đã mua
    fetchUserPurchasedProducts: async (userId, params) => {
        set({ loading: true, error: null });
        try {
            const response = await orderItemService.getUserPurchasedProducts(userId, params);
            set({ purchasedProducts: response.data || response, loading: false });
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Lấy order item theo ID
    fetchOrderItemById: async (itemId) => {
        set({ loading: true, error: null });
        try {
            const response = await orderItemService.getOrderItemById(itemId);
            set({ currentItem: response.data || response, loading: false });
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Lấy tất cả items của một đơn hàng
    fetchOrderItems: async (orderId) => {
        set({ loading: true, error: null });
        try {
            const response = await orderItemService.getOrderItems(orderId);
            set({ orderItems: response.data || response, loading: false });
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Tính tổng giá trị đơn hàng
    calculateOrderTotal: async (orderId) => {
        set({ loading: true, error: null });
        try {
            const response = await orderItemService.calculateOrderTotal(orderId);
            set({ loading: false });
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Cập nhật order item
    updateOrderItem: async (itemId, data) => {
        set({ loading: true, error: null });
        try {
            const response = await orderItemService.updateOrderItem(itemId, data);
            set({ loading: false });
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Xóa order item
    deleteOrderItem: async (itemId) => {
        set({ loading: true, error: null });
        try {
            const response = await orderItemService.deleteOrderItem(itemId);
            set((state) => ({
                orderItems: state.orderItems.filter(item => item.order_item_id !== itemId),
                loading: false
            }));
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
        orderItems: [], 
        currentItem: null, 
        bestSellers: [], 
        revenueData: null, 
        purchasedProducts: [], 
        loading: false, 
        error: null 
    })
}));