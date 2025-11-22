import { create } from 'zustand';
import { orderService } from '@/services/orderService';

export const useOrderStore = create((set) => ({
    orders: [],
    currentOrder: null,
    pagination: null,
    loading: false,
    error: null,

    // Tạo đơn hàng mới
    createOrder: async (data) => {
        set({ loading: true, error: null });
        try {
            const response = await orderService.createOrder(data);
            set({ loading: false });
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Lấy danh sách đơn hàng với filter
    fetchOrders: async (params) => {
        set({ loading: true, error: null });
        try {
            const response = await orderService.getOrders(params);
            
            // API trả về camelCase (orderId, orderNumber, etc.)
            const ordersData = Array.isArray(response.data) ? response.data : [];
            
            set({ 
                orders: ordersData, 
                pagination: response.pagination || null,
                loading: false 
            });
            return response;
        } catch (error) {
            console.error('Error in fetchOrders:', error);
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Lấy chi tiết đơn hàng
    fetchOrderById: async (orderId) => {
        set({ loading: true, error: null });
        try {
            const response = await orderService.getOrderById(orderId);
            const orderData = response.data || response;
            set({ currentOrder: orderData, loading: false });
            return orderData;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Xác nhận đơn hàng
    confirmOrder: async (orderId) => {
        set({ loading: true, error: null });
        try {
            const response = await orderService.confirmOrder(orderId);
            set({ loading: false });
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Chuyển sang trạng thái xử lý
    processOrder: async (orderId) => {
        set({ loading: true, error: null });
        try {
            const response = await orderService.processOrder(orderId);
            set({ loading: false });
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Chuyển sang trạng thái giao hàng
    shipOrder: async (orderId) => {
        set({ loading: true, error: null });
        try {
            const response = await orderService.shipOrder(orderId);
            set({ loading: false });
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Hoàn thành đơn hàng
    deliverOrder: async (orderId) => {
        set({ loading: true, error: null });
        try {
            const response = await orderService.deliverOrder(orderId);
            set({ loading: false });
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Hủy đơn hàng
    cancelOrder: async (orderId, reason) => {
        set({ loading: true, error: null });
        try {
            const response = await orderService.cancelOrder(orderId, reason);
            set({ loading: false });
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Hoàn tiền
    refundOrder: async (orderId, amount) => {
        set({ loading: true, error: null });
        try {
            const response = await orderService.refundOrder(orderId, amount);
            set({ loading: false });
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Cập nhật trạng thái đơn hàng (tổng quát)
    updateOrderStatus: async (orderId, status) => {
        set({ loading: true, error: null });
        try {
            const response = await orderService.updateOrderStatus(orderId, status);
            set({ loading: false });
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Cập nhật trạng thái thanh toán
    updatePaymentStatus: async (orderId, status) => {
        set({ loading: true, error: null });
        try {
            const response = await orderService.updatePaymentStatus(orderId, status);
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
        orders: [], 
        currentOrder: null, 
        pagination: null, 
        loading: false, 
        error: null 
    })
}));