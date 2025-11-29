import api from '@/lib/axios';

const BASE_URL = '/installment-policies';

export const installmentPolicyService = {
    // Admin - Lấy tất cả chính sách
    getAllPolicies: async () => {
        const response = await api.get(BASE_URL);
        return response.data;
    },

    // Public - Lấy chính sách đang hoạt động
    getActivePolicies: async () => {
        const response = await api.get(`${BASE_URL}/active`);
        return response.data;
    },

    // Admin - Tạo chính sách mới
    createPolicy: async (data) => {
        const response = await api.post(BASE_URL, data);
        return response.data;
    },

    // Admin - Cập nhật chính sách
    updatePolicy: async (id, data) => {
        const response = await api.put(`${BASE_URL}/${id}`, data);
        return response.data;
    },

    // Admin - Xóa chính sách
    deletePolicy: async (id) => {
        const response = await api.delete(`${BASE_URL}/${id}`);
        return response.data;
    },

    // Admin - Toggle trạng thái
    togglePolicyStatus: async (id) => {
        const response = await api.patch(`${BASE_URL}/${id}/toggle`);
        return response.data;
    }
};
