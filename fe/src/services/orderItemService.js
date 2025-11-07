import api from '@/lib/axios';

export const orderItemService = {
    // Tạo order item mới
    createOrderItem: async (data) => {
        const response = await api.post('/order-items', data);
        return response.data;
    },

    // Lấy sản phẩm bán chạy nhất
    getBestSellers: async (params = {}) => {
        const response = await api.get('/order-items/best-sellers', { params });
        return response.data;
    },

    // Lấy thống kê doanh thu theo sản phẩm
    getRevenueByProduct: async (params = {}) => {
        const response = await api.get('/order-items/revenue', { params });
        return response.data;
    },

    // Kiểm tra sản phẩm đã được mua bởi user chưa
    checkPurchased: async (userId, variantId) => {
        const response = await api.get(`/order-items/user/${userId}/variant/${variantId}/purchased`);
        return response.data;
    },

    // Lấy danh sách sản phẩm user đã mua
    getUserPurchasedProducts: async (userId, params = {}) => {
        const response = await api.get(`/order-items/user/${userId}/purchased-products`, { params });
        return response.data;
    },

    // Lấy order item theo ID
    getOrderItemById: async (itemId) => {
        const response = await api.get(`/order-items/${itemId}`);
        return response.data;
    },

    // Lấy tất cả items của một đơn hàng
    getOrderItems: async (orderId) => {
        const response = await api.get(`/order-items/order/${orderId}`);
        return response.data;
    },

    // Tính tổng giá trị đơn hàng
    calculateOrderTotal: async (orderId) => {
        const response = await api.get(`/order-items/order/${orderId}/total`);
        return response.data;
    },

    // Lấy items theo variant ID (lịch sử mua hàng)
    getOrderItemsByVariant: async (variantId, params = {}) => {
        const response = await api.get(`/order-items/variant/${variantId}`, { params });
        return response.data;
    },

    // Cập nhật order item
    updateOrderItem: async (itemId, data) => {
        const response = await api.put(`/order-items/${itemId}`, data);
        return response.data;
    },

    // Xóa order item
    deleteOrderItem: async (itemId) => {
        const response = await api.delete(`/order-items/${itemId}`);
        return response.data;
    },

    // Xóa tất cả items của một đơn hàng
    deleteOrderItems: async (orderId) => {
        const response = await api.delete(`/order-items/order/${orderId}`);
        return response.data;
    }
};