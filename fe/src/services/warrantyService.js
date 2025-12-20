import { userApi } from '@/lib/axios';

/**
 * Warranty Service - View warranty information
 */
export const warrantyService = {
    // Lấy thông tin bảo hành theo serial number
    getBySerialNumber: async (serialNumber) => {
        const response = await userApi.get(`/warranty/serial/${serialNumber}`);
        return response.data;
    },

    // Lấy thông tin bảo hành theo order item
    getByOrderItem: async (orderItemId) => {
        const response = await userApi.get(`/warranty/order-item/${orderItemId}`);
        return response.data;
    },

    // Lấy danh sách bảo hành sắp hết hạn
    getExpiring: async (days = 30) => {
        const response = await userApi.get('/warranty/expiring', { params: { days } });
        return response.data;
    }
};
