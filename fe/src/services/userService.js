import api from '@/lib/axios';

export const userService = {
    // Lấy danh sách users với phân trang và tìm kiếm
    listUsers: async (params = {}) => {
        const { search = '', role = '', is_active = '', page = 1, pageSize = 10 } = params;
        const response = await api.get('/users', {
            params: { search, role, is_active, page, pageSize }
        });
        return response.data;
    },

    // Lấy thông tin user theo ID
    getUserById: async (userId) => {
        const response = await api.get(`/users/${userId}`);
        return response.data;
    },

    // Tạo user mới
    createUser: async (userData) => {
        const response = await api.post('/users', userData);
        return response.data;
    },

    // Cập nhật user
    updateUser: async (userId, userData) => {
        const response = await api.put(`/users/${userId}`, userData);
        return response.data;
    },

    // Xóa user
    deleteUser: async (userId) => {
        const response = await api.delete(`/users/${userId}`);
        return response.data;
    },
};

