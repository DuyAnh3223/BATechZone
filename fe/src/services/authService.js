import api from '@/lib/axios';

export const authService = {
    // Kiểm tra trạng thái đăng nhập
    checkAuth: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    // Đăng nhập admin
    adminSignIn: async (username, password) => {
        const response = await api.post('/auth/admin_signin', { username, password });
        return response.data;
    },

    // Đăng nhập user
    signIn: async (email, password) => {
        const response = await api.post('/auth/signin', { email, password });
        return response.data;
    },

    // Đăng ký
    signUp: async (username, password, email) => {
        const response = await api.post('/auth/signup', { username, password, email });
        return response.data;
    },

    // Đăng xuất
    signOut: async () => {
        const response = await api.post('/auth/signout');
        return response.data;
    },

    // Cập nhật profile
    updateProfile: async (fullName, phone, email) => {
        const response = await api.put('/auth/profile', { fullName, phone, email });
        return response.data;
    },
};