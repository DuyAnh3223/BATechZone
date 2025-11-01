import api from '@/lib/axios';

export const authService = {
    signUp: async (username, password, email) => {
        const res = await api.post('/auth/signup', { username, password, email }, { withCredentials: true });
        return res.data;
    },
};