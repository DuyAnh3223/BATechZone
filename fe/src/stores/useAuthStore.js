import { create } from 'zustand';
import { toast } from 'sonner';
import { authService } from '@/services/authService';

export const useAuthStore = create((set, get) => ({
    user: null,
    loading: true,

    // Kiểm tra trạng thái đăng nhập
    checkAuth: async () => {
        try {
            const response = await authService.checkAuth();
            if (response?.success) {
                set({ user: response.user, loading: false });
            } else {
                set({ user: null, loading: false });
            }
        } catch (error) {
            set({ user: null, loading: false });
        }
    },

    // Đăng nhập admin
    adminSignIn: async (username, password) => {
        try {
            const response = await authService.adminSignIn(username, password);
            const { user } = response;
            set({ user });
            return user;
        } catch (error) {
            const message = error.response?.data?.message || 'Đăng nhập thất bại';
            throw new Error(message);
        }
    },

    // Đăng nhập user
    signIn: async (email, password) => {
        try {
            const response = await authService.signIn(email, password);
            const { user } = response;
            set({ user });
            return user;
        } catch (error) {
            const message = error.response?.data?.message || 'Đăng nhập thất bại';
            throw new Error(message);
        }
    },

    // Đăng ký
    signUp: async (username, password, email) => {
        try {
            const response = await authService.signUp(username, password, email);
            toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Đăng ký thất bại';
            throw new Error(message);
        }
    },

    // Đăng xuất
    signOut: async () => {
        try {
            await authService.signOut();
            set({ user: null });
            toast.success('Đăng xuất thành công');
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Có lỗi xảy ra khi đăng xuất');
        }
    },

    // Cập nhật profile
    updateProfile: async (fullName, phone, email) => {
        try {
            const response = await authService.updateProfile(fullName, phone, email);
            set({ user: response.user });
            toast.success('Cập nhật hồ sơ thành công');
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Cập nhật thất bại';
            throw new Error(message);
        }
    },

    // Helper để lấy thông tin user hiện tại
    getUser: () => get().user,

    // Helper để kiểm tra xem user có đăng nhập không
    isAuthenticated: () => !!get().user,

    // Helper để kiểm tra role
    isAdmin: () => get().user?.role === 2,
    isShipper: () => get().user?.role === 1,
    isUser: () => get().user?.role === 0,
}));