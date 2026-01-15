import { adminApi, userApi } from '@/lib/axios';
import axios from 'axios';

const baseURL = import.meta.env.MODE === 'development' ? "http://localhost:5001/api" : "/api";

export const authService = {
    // ==================== ADMIN AUTH ====================
    
    // Kiểm tra trạng thái đăng nhập admin
    checkAdminAuth: async () => {
        const response = await adminApi.get('/auth/admin/me');
        return response.data;
    },

    // Đăng nhập admin (JWT)
    adminSignIn: async (username, password) => {
        const response = await axios.post(`${baseURL}/auth/admin_signin`, 
            { username, password },
            { withCredentials: true }
        );
        
        // Store access token in localStorage
        if (response.data.success && response.data.accessToken) {
            localStorage.setItem('admin_access_token', response.data.accessToken);
        }
        
        return response.data;
    },

    // Refresh admin access token
    refreshAdminToken: async () => {
        const response = await axios.post(`${baseURL}/auth/refresh-admin`, {}, {
            withCredentials: true
        });
        
        if (response.data.success && response.data.accessToken) {
            localStorage.setItem('admin_access_token', response.data.accessToken);
        }
        
        return response.data.accessToken;
    },

    // Đăng xuất admin
    signOutAdmin: async () => {
        const response = await adminApi.post('/auth/signout');
        
        // Clear admin tokens
        localStorage.removeItem('admin_access_token');
        
        return response.data;
    },

    // ==================== USER AUTH ====================
    
    // Kiểm tra trạng thái đăng nhập user
    checkUserAuth: async () => {
        const response = await userApi.get('/auth/user/me');
        return response.data;
    },

    // Đăng nhập user (JWT)
    signIn: async (email, password) => {
        const response = await axios.post(`${baseURL}/auth/signin`, 
            { email, password },
            { withCredentials: true }
        );
        
        // Store access token in localStorage
        if (response.data.success && response.data.accessToken) {
            localStorage.setItem('user_access_token', response.data.accessToken);
        }
        
        return response.data;
    },

    // Đăng ký
    signUp: async (username, password, email, fullName, phone) => {
        const response = await axios.post(`${baseURL}/auth/signup`, 
            { 
                username, 
                password, 
                email, 
                full_name: fullName,  // Convert camelCase to snake_case
                phone 
            },
            { withCredentials: true }
        );
        return response.data;
    },

    // Refresh user access token
    refreshUserToken: async () => {
        const response = await axios.post(`${baseURL}/auth/refresh-user`, {}, {
            withCredentials: true
        });
        
        if (response.data.success && response.data.accessToken) {
            localStorage.setItem('user_access_token', response.data.accessToken);
        }
        
        return response.data.accessToken;
    },

    // Đăng xuất user
    signOut: async () => {
        const response = await userApi.post('/auth/signout');
        
        // Clear user tokens
        localStorage.removeItem('user_access_token');
        
        return response.data;
    },

    // ==================== COMMON AUTH (Backward Compatibility) ====================
    
    // Kiểm tra trạng thái đăng nhập (dùng chung - deprecated)
    checkAuth: async () => {
        // Try user first, then admin
        try {
            return await authService.checkUserAuth();
        } catch (error) {
            try {
                return await authService.checkAdminAuth();
            } catch (error2) {
                throw error2;
            }
        }
    },

    // Cập nhật profile
    updateProfile: async (fullName, phone, email) => {
        const response = await userApi.put('/auth/profile', { fullName, phone, email });
        return response.data;
    },
};