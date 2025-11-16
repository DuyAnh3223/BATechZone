import api from '@/lib/axios';

export const orderService = {
    // Tạo đơn hàng mới
    createOrder: async (data) => {
        const response = await api.post('/orders', data);
        return response.data;
    },

    // Lấy danh sách đơn hàng với filter
    getOrders: async (params = {}) => {
        const response = await api.get('/orders', { params });
        return response.data;
    },

    // Lấy chi tiết đơn hàng
    getOrderById: async (orderId) => {
        const response = await api.get(`/orders/${orderId}`);
        return response.data;
    },

    // Xác nhận đơn hàng
    confirmOrder: async (orderId) => {
        const response = await api.patch(`/orders/${orderId}/confirm`);
        return response.data;
    },

    // Chuyển sang trạng thái xử lý
    processOrder: async (orderId) => {
        const response = await api.patch(`/orders/${orderId}/process`);
        return response.data;
    },

    // Chuyển sang trạng thái giao hàng
    shipOrder: async (orderId) => {
        const response = await api.patch(`/orders/${orderId}/ship`);
        return response.data;
    },

    // Hoàn thành đơn hàng
    deliverOrder: async (orderId) => {
        const response = await api.patch(`/orders/${orderId}/deliver`);
        return response.data;
    },

    // Hủy đơn hàng
    cancelOrder: async (orderId, reason) => {
        const response = await api.patch(`/orders/${orderId}/cancel`, { reason });
        return response.data;
    },

    // Hoàn tiền
    refundOrder: async (orderId, amount) => {
        const response = await api.patch(`/orders/${orderId}/refund`, { amount });
        return response.data;
    },

    // Cập nhật trạng thái đơn hàng (tổng quát)
    updateOrderStatus: async (orderId, status) => {
        const response = await api.patch(`/orders/${orderId}/status`, { status });
        return response.data;
    },

    // Cập nhật trạng thái thanh toán
    updatePaymentStatus: async (orderId, status) => {
        const response = await api.patch(`/orders/${orderId}/payment-status`, { status });
        return response.data;
    }
};