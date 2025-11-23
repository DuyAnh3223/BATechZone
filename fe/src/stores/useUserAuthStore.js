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
            console.log('[useUserAuthStore] Calling checkUserAuth...');
            const response = await authService.checkUserAuth();
            console.log('[useUserAuthStore] Response:', response);
            if (response?.success) {
                console.log('[useUserAuthStore] Setting user:', response.user);
                set({ user: response.user, loading: false });
            } else {
                console.log('[useUserAuthStore] No success, clearing user');
                set({ user: null, loading: false });
            }
        } catch (error) {
            console.log('[useUserAuthStore] Error during checkAuth:', error.response?.status, error.response?.data);
            // Im lặng xử lý lỗi 401 (chưa đăng nhập)
            set({ user: null, loading: false });
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
            // Vẫn set user = null và xóa giỏ hàng khỏi localStorage ngay cả khi API lỗi
            set({ user: null });
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
