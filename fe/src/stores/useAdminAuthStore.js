import { create } from 'zustand';
import { toast } from 'sonner';
import { authService } from '@/services/authService';

export const useAdminAuthStore = create((set, get) => ({
    user: null,
    loading: true,

    // Kiểm tra trạng thái đăng nhập admin
    checkAuth: async () => {
        try {
            const response = await authService.checkAdminAuth();
            if (response?.success) {
                set({ user: response.user, loading: false });
            } else {
                set({ user: null, loading: false });
            }
        } catch (error) {
            // Im lặng xử lý lỗi 401 (chưa đăng nhập)
            // Don't log silent errors
            if (!error._silent) {
                console.error('[Admin Auth] Check auth failed:', error);
            }
            set({ user: null, loading: false });
        }
    },

    // Đăng nhập admin (JWT)
    adminSignIn: async (username, password) => {
        try {
            const response = await authService.adminSignIn(username, password);
            
            // JWT response contains accessToken and user
            const { user, accessToken } = response;
            
            // Access token is already stored in localStorage by authService
            // Update the user state AND loading to false immediately
            set({ user, loading: false });
            
            return user;
        } catch (error) {
            const message = error.response?.data?.message || 'Đăng nhập thất bại';
            throw new Error(message);
        }
    },

    // Đăng xuất admin (JWT)
    signOut: async () => {
        try {
            await authService.signOutAdmin();
            
            // Clear user state
            set({ user: null });
            
            // Access token already cleared by authService
            toast.success('Đăng xuất thành công');
        } catch (error) {
            console.error('Logout error:', error);
            
            // Even if API fails, clear local state
            set({ user: null });
            localStorage.removeItem('admin_access_token');
            
            toast.error('Có lỗi xảy ra khi đăng xuất');
        }
    },

    // Helper để lấy thông tin user hiện tại
    getUser: () => get().user,

    // Helper để kiểm tra xem user có đăng nhập không
    isAuthenticated: () => !!get().user,

    // Helper để kiểm tra role
    isAdmin: () => get().user?.role === 2,
}));
