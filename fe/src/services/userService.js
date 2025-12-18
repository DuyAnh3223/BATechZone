import { adminApi } from '@/lib/axios';

export const userService = {
    // Láº¥y danh sÃ¡ch users vá»›i phÃ¢n trang vÃ  tÃ¬m kiáº¿m
    listUsers: async (params = {}) => {
        const { search = '', role = '', is_active = '', page = 1, pageSize = 10 } = params;
        const response = await adminApi.get('/users', {
            params: { search, role, is_active, page, pageSize }
        });
        return response.data;
    },

    // Láº¥y thÃ´ng tin user theo ID
    getUserById: async (userId) => {
        const response = await adminApi.get(`/users/${userId}`);
        return response.data;
    },

    // Táº¡o user má»›i
    createUser: async (userData) => {
        const response = await adminApi.post('/users', userData);
        return response.data;
    },

    // Cáº­p nháº­t user
    updateUser: async (userId, userData) => {
        const response = await adminApi.put(`/users/${userId}`, userData);
        return response.data;
    },

    // XÃ³a user
    deleteUser: async (userId) => {
        const response = await adminApi.delete(`/users/${userId}`);
        return response.data;
    },
};


