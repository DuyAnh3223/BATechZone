import { adminApi, userApi } from '@/lib/axios';

export const orderService = {
    // Tạo đơn hàng mới (user)
    createOrder: async (data) => {
        const response = await userApi.post('/orders', data);
        return response.data;
    },

    // Lấy danh sách đơn hàng với filter (admin hoặc user - context-dependent)
    // Note: This is used by both admin and user, caller must use appropriate API
    getOrders: async (params = {}, isAdmin = false) => {
        const api = isAdmin ? adminApi : userApi;
        const response = await api.get('/orders', { params });
        return response.data;
    },

    // Lấy chi tiết đơn hàng (admin hoặc user - context-dependent)
    getOrderById: async (orderId, isAdmin = false) => {
        const api = isAdmin ? adminApi : userApi;
        const response = await api.get(`/orders/${orderId}`);
        return response.data;
    },

    // Xác nhận đơn hàng (admin only)
    confirmOrder: async (orderId) => {
        const response = await adminApi.patch(`/orders/${orderId}/confirm`);
        return response.data;
    },

    // Chuyển sang trạng thái xử lý (admin only)
    processOrder: async (orderId) => {
        const response = await adminApi.patch(`/orders/${orderId}/process`);
        return response.data;
    },

    // Chuyển sang trạng thái giao hàng (admin only)
    shipOrder: async (orderId) => {
        const response = await adminApi.patch(`/orders/${orderId}/ship`);
        return response.data;
    },

    // Hoàn thành đơn hàng (admin only)
    deliverOrder: async (orderId) => {
        const response = await adminApi.patch(`/orders/${orderId}/deliver`);
        return response.data;
    },

    // Hủy đơn hàng (admin or user)
    cancelOrder: async (orderId, reason, isAdmin = false) => {
        const api = isAdmin ? adminApi : userApi;
        const response = await api.patch(`/orders/${orderId}/cancel`, { reason });
        return response.data;
    },

    // Hoàn tiền (admin only)
    refundOrder: async (orderId, amount) => {
        const response = await adminApi.patch(`/orders/${orderId}/refund`, { amount });
        return response.data;
    },

    // Cập nhật trạng thái đơn hàng (admin only)
    updateOrderStatus: async (orderId, status) => {
        const response = await adminApi.patch(`/orders/${orderId}/status`, { status });
        return response.data;
    },

    // Cập nhật trạng thái thanh toán (admin only)
    updatePaymentStatus: async (orderId, status) => {
        const response = await adminApi.patch(`/orders/${orderId}/payment-status`, { status });
        return response.data;
    },

    // Theo dõi đơn hàng theo số điện thoại (public - không cần auth)
    trackOrderByPhone: async (phone) => {
        const response = await userApi.get(`/orders/track/${phone}`);
        return response.data;
    }
};