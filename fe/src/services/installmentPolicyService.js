import { adminApi } from '@/lib/axios';

const BASE_URL = '/installment-policies';

export const installmentPolicyService = {
    // Admin - Láº¥y táº¥t cáº£ chÃ­nh sÃ¡ch
    getAllPolicies: async () => {
        const response = await adminApi.get(BASE_URL);
        return response.data;
    },

    // Public - Láº¥y chÃ­nh sÃ¡ch Ä‘ang hoáº¡t Ä‘á»™ng
    getActivePolicies: async () => {
        const response = await adminApi.get(`${BASE_URL}/active`);
        return response.data;
    },

    // Admin - Táº¡o chÃ­nh sÃ¡ch má»›i
    createPolicy: async (data) => {
        const response = await adminApi.post(BASE_URL, data);
        return response.data;
    },

    // Admin - Cáº­p nháº­t chÃ­nh sÃ¡ch
    updatePolicy: async (id, data) => {
        const response = await adminApi.put(`${BASE_URL}/${id}`, data);
        return response.data;
    },

    // Admin - XÃ³a chÃ­nh sÃ¡ch
    deletePolicy: async (id) => {
        const response = await adminApi.delete(`${BASE_URL}/${id}`);
        return response.data;
    },

    // Admin - Toggle tráº¡ng thÃ¡i
    togglePolicyStatus: async (id) => {
        const response = await adminApi.patch(`${BASE_URL}/${id}/toggle`);
        return response.data;
    }
};

