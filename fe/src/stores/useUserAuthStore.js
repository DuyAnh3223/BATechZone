import { create } from 'zustand';
import { toast } from 'sonner';
import { authService } from '@/services/authService';
import { useCartStore } from './useCartStore';
import { useCartItemStore } from './useCartItemStore';

export const useUserAuthStore = create((set, get) => ({
    user: null,
    loading: true,

    // Kiểm tra trạng thái đăng nhập user
    checkAuth: async () => {
        try {
            console.log('[UserAuthStore] checkAuth - calling authService.checkUserAuth()...');
            const response = await authService.checkUserAuth();
            console.log('[UserAuthStore] checkAuth response:', response);
            if (response?.success) {
                console.log('[UserAuthStore] Setting user:', response.user);
                set({ user: response.user, loading: false });
            } else {
                console.log('[UserAuthStore] No success in response, clearing user');
                set({ user: null, loading: false });
            }
        } catch (error) {
            // Im lặng xử lý lỗi 401 (chưa đăng nhập)
            console.error('[UserAuthStore] checkAuth error:', error);
            // Don't log silent errors
            if (!error._silent) {
                console.error('[User Auth] Check auth failed:', error);
            }
            set({ user: null, loading: false });
        }
    },

    // Đăng nhập user (JWT)
    signIn: async (email, password) => {
        try {
            const response = await authService.signIn(email, password);
            
            // JWT response contains accessToken and user
            const { user, accessToken } = response;
            
            // Access token is already stored in localStorage by authService
            // Force new object reference to ensure Zustand triggers re-render
            set({ user: { ...user }, loading: false });
            
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

    // Đăng xuất user (JWT)
    signOut: async () => {
        try {
            await authService.signOut();
            
            // Clear user state
            set({ user: null });
            
            // Access token already cleared by authService
            
            // Xóa giỏ hàng khỏi localStorage (chỉ để ẩn UI, không xóa database)
            // Khi user login lại, giỏ hàng sẽ tự động load lại từ database
            localStorage.removeItem('cart-storage');
            localStorage.removeItem('cart-items-storage');
            
            // Reset state của cart stores (chỉ clear memory, không ảnh hưởng database)
            useCartStore.getState().reset();
            useCartItemStore.getState().reset();
            
            toast.success('Đăng xuất thành công');
        } catch (error) {
            console.error('Logout error:', error);
            
            // Even if API fails, clear local state
            set({ user: null });
            localStorage.removeItem('user_access_token');
            localStorage.removeItem('cart-storage');
            localStorage.removeItem('cart-items-storage');
            useCartStore.getState().reset();
            useCartItemStore.getState().reset();
            
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
    isUser: () => get().user?.role === 0,
}));
