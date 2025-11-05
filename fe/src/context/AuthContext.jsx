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

    // Kiểm tra trạng thái đăng nhập khi load trang (dựa trên cookie)
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await api.get('/auth/me');
                if (response.data?.success) {
                    setUser(response.data.user);
                } else {
                    setUser(null);
                }
            } catch (error) {
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
            const { user } = response.data;
            setUser(user);
            return user;
        } catch (error) {
            const message = error.response?.data?.message || 'Đăng nhập thất bại';
            throw new Error(message);
        }
    };

    const login = async (credentials) => {
        try {
            const response = await api.post('/auth/signin', credentials);
            const { user } = response.data;
            setUser(user);
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
            toast.success('Cập nhật hồ sơ thành công');
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Cập nhật thất bại';
            throw new Error(message);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, adminLogin, login, register, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;