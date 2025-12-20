import { userApi } from '@/lib/axios';

export const profileService = {
    // Lấy thông tin profile của user hiện tại
    getProfile: async () => {
        const response = await userApi.get('/user/profile');
        return response.data;
    },

    // Cập nhật profile của user hiện tại
    updateProfile: async (data) => {
        const response = await userApi.put('/user/profile', data);
        return response.data;
    }
};