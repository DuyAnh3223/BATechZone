import { createContext, useContext, useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const user = useAuthStore((state) => state.user);
    const loading = useAuthStore((state) => state.loading);
    const checkAuth = useAuthStore((state) => state.checkAuth);
    const storeSignIn = useAuthStore((state) => state.signIn);
    const storeAdminSignIn = useAuthStore((state) => state.adminSignIn);
    const storeSignUp = useAuthStore((state) => state.signUp);
    const storeSignOut = useAuthStore((state) => state.signOut);
    const storeUpdateProfile = useAuthStore((state) => state.updateProfile);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const adminLogin = async ({ username, password }) => {
        return storeAdminSignIn(username, password);
    };

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
        <AuthContext.Provider value={{ user, loading, adminLogin, login, register, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;