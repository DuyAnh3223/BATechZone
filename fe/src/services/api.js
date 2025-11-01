import axiosInstance from '../lib/axios';

export const authApi = {
    signin: async (credentials) => {
        try {
            const response = await axiosInstance.post('/auth/signin', credentials);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    signup: async (userData) => {
        try {
            const response = await axiosInstance.post('/auth/signup', userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    signout: async () => {
        try {
            const response = await axiosInstance.post('/auth/signout');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getProfile: async () => {
        try {
            const response = await axiosInstance.get('/auth/me');
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export const testConnection = async () => {
    try {
        const response = await axiosInstance.get('/test');
        console.log('Backend connection successful:', response.data);
        return true;
    } catch (error) {
        console.error('Backend connection failed:', error);
        return false;
    }
};