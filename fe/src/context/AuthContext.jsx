import { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/axios';
import { toast } from 'sonner';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Kiểm tra trạng thái đăng nhập khi load trang
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const response = await api.get('/auth/me');
                    setUser(response.data.user);
                }
            } catch (error) {
                localStorage.removeItem('token');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const adminLogin = async (credentials) => {
        try {
            const response = await api.post('/auth/admin_signin', credentials);
            const { user, token } = response.data;
            
            setUser(user);
            localStorage.setItem('token', token);
            
            // Thêm token vào header mặc định của api
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            return user;
        } catch (error) {
            const message = error.response?.data?.message || 'Đăng nhập thất bại';
            throw new Error(message);
        }
    };

    const login = async (credentials) => {
        try {
            const response = await api.post('/auth/signin', credentials);
            const { user, token } = response.data;
            
            setUser(user);
            localStorage.setItem('token', token);
            
            // Thêm token vào header mặc định của api
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            return user;
        } catch (error) {
            const message = error.response?.data?.message || 'Đăng nhập thất bại';
            throw new Error(message);
        }
    };

    const register = async (userData) => {
        try {
            const response = await api.post('/auth/signup', userData);
            toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Đăng ký thất bại';
            throw new Error(message);
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/signout');
            setUser(null);
            localStorage.removeItem('token');
            delete api.defaults.headers.common['Authorization'];
            toast.success('Đăng xuất thành công');
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Có lỗi xảy ra khi đăng xuất');
        }
    };

    const updateProfile = async (profileData) => {
        try {
            const response = await api.put('/auth/profile', profileData);
            setUser(response.data.user);
            toast.success('Cập nhật thông tin thành công');
            return response.data.user;
        } catch (error) {
            const message = error.response?.data?.message || 'Cập nhật thất bại';
            throw new Error(message);
        }
    };

    const changePassword = async (passwordData) => {
        try {
            await api.put('/auth/change-password', passwordData);
            toast.success('Đổi mật khẩu thành công');
        } catch (error) {
            const message = error.response?.data?.message || 'Đổi mật khẩu thất bại';
            throw new Error(message);
        }
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        adminLogin
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;