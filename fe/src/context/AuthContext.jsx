import { createContext, useContext, useEffect } from 'react';
import { useUserAuthStore } from '@/stores/useUserAuthStore';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const user = useUserAuthStore((state) => state.user);
    const loading = useUserAuthStore((state) => state.loading);
    const checkAuth = useUserAuthStore((state) => state.checkAuth);
    const storeSignIn = useUserAuthStore((state) => state.signIn);
    const storeSignUp = useUserAuthStore((state) => state.signUp);
    const storeSignOut = useUserAuthStore((state) => state.signOut);
    const storeUpdateProfile = useUserAuthStore((state) => state.updateProfile);

    useEffect(() => {
        checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Chỉ chạy 1 lần khi mount

    const login = async ({ email, password }) => {
        return storeSignIn(email, password);
    };

    const register = async ({ username, email, password }) => {
        return storeSignUp(username, password, email);
    };

    const logout = async () => {
        await storeSignOut();
    };

    const updateProfile = async ({ fullName, phone, email }) => {
        return storeUpdateProfile(fullName, phone, email);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;