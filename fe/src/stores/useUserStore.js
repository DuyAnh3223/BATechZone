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
                toast.success('Tạo người dùng thành công', {
                    description: response.message || `Đã tạo tài khoản ${userData.username} thành công`
                });
                set({ loading: false });
                return response.data;
            } else {
                set({ loading: false });
                throw new Error(response?.message || 'Tạo user thất bại');
            }
        } catch (error) {
            set({ loading: false });
            const message = error.response?.data?.message || error.message || 'Không thể tạo người dùng mới';
            toast.error('Tạo người dùng thất bại', {
                description: message
            });
            throw new Error(message);
        }
    },

    // Cập nhật user
    updateUser: async (userId, userData) => {
        set({ loading: true });
        try {
            const response = await userService.updateUser(userId, userData);
            if (response?.success) {
                toast.success('Cập nhật người dùng thành công', {
                    description: `Đã cập nhật thông tin người dùng ${userData.username} thành công`
                });
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
            const message = error.response?.data?.message || error.message || 'Không thể cập nhật thông tin người dùng';
            toast.error('Cập nhật người dùng thất bại', {
                description: message
            });
            throw new Error(message);
        }
    },

    // Xóa user
    deleteUser: async (userId) => {
        set({ loading: true });
        try {
            // Lấy thông tin user trước khi xóa để hiển thị username trong thông báo
            const state = get();
            const userToDelete = state.users.find(u => u.user_id === parseInt(userId));
            const username = userToDelete?.username || 'người dùng';
            
            const response = await userService.deleteUser(userId);
            if (response?.success) {
                // Cập nhật danh sách users
                set((state) => ({
                    users: state.users.filter(u => u.user_id !== parseInt(userId)),
                    pagination: {
                        ...state.pagination,
                        total: Math.max(0, state.pagination.total - 1)
                    },
                    loading: false
                }));
                toast.success('Xóa người dùng thành công', {
                    description: `Đã xóa người dùng ${username} thành công`
                });
                return response;
            } else {
                set({ loading: false });
                throw new Error(response?.message || 'Xóa user thất bại');
            }
        } catch (error) {
            set({ loading: false });
            const message = error.response?.data?.message || error.message || 'Không thể xóa người dùng';
            toast.error('Xóa người dùng thất bại', {
                description: message
            });
            throw new Error(message);
        }
    },

    // Reset current user
    resetCurrentUser: () => {
        set({ currentUser: null });
    },
}));

