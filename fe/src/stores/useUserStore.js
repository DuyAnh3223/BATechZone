import { create } from 'zustand';
import { toast } from 'sonner';
import { userService } from '@/services/userService';

export const useUserStore = create((set, get) => ({
    users: [],
    currentUser: null,
    loading: false,
    pagination: {
        total: 0,
        page: 1,
        pageSize: 10,
    },

    // Lấy danh sách users
    listUsers: async (params = {}) => {
        set({ loading: true });
        try {
            const response = await userService.listUsers(params);
            if (response?.success) {
                set({
                    users: response.data || [],
                    pagination: response.pagination || { total: 0, page: 1, pageSize: 10 },
                    loading: false,
                });
                return response;
            } else {
                set({ loading: false });
                throw new Error(response?.message || 'Lỗi lấy danh sách users');
            }
        } catch (error) {
            set({ loading: false });
            const message = error.response?.data?.message || 'Lỗi lấy danh sách users';
            throw new Error(message);
        }
    },

    // Lấy thông tin user theo ID
    getUserById: async (userId) => {
        set({ loading: true });
        try {
            const response = await userService.getUserById(userId);
            if (response?.success) {
                set({ currentUser: response.data, loading: false });
                return response.data;
            } else {
                set({ loading: false });
                throw new Error(response?.message || 'Không tìm thấy user');
            }
        } catch (error) {
            set({ loading: false });
            const message = error.response?.data?.message || 'Lỗi lấy thông tin user';
            throw new Error(message);
        }
    },

    // Tạo user mới
    createUser: async (userData) => {
        set({ loading: true });
        try {
            const response = await userService.createUser(userData);
            if (response?.success) {
                toast.success(response.message || 'Tạo user thành công');
                set({ loading: false });
                return response.data;
            } else {
                set({ loading: false });
                throw new Error(response?.message || 'Tạo user thất bại');
            }
        } catch (error) {
            set({ loading: false });
            const message = error.response?.data?.message || 'Tạo user thất bại';
            toast.error(message);
            throw new Error(message);
        }
    },

    // Cập nhật user
    updateUser: async (userId, userData) => {
        set({ loading: true });
        try {
            const response = await userService.updateUser(userId, userData);
            if (response?.success) {
                toast.success(response.message || 'Cập nhật user thành công');
                // Cập nhật user trong danh sách nếu có
                const users = get().users;
                const updatedUsers = users.map(user =>
                    user.user_id === parseInt(userId) ? response.data : user
                );
                set({ users: updatedUsers, currentUser: response.data, loading: false });
                return response.data;
            } else {
                set({ loading: false });
                throw new Error(response?.message || 'Cập nhật user thất bại');
            }
        } catch (error) {
            set({ loading: false });
            const message = error.response?.data?.message || 'Cập nhật user thất bại';
            toast.error(message);
            throw new Error(message);
        }
    },

    // Reset current user
    resetCurrentUser: () => {
        set({ currentUser: null });
    },
}));

