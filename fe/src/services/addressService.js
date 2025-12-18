import { userApi } from '@/lib/axios';

export const addressService = {
    getAddresses: async () => {
        const response = await userApi.get('/addresses');
        return response.data;
    },

    getAddressById: async (addressId) => {
        const response = await userApi.get(`/addresses/${addressId}`);
        return response.data;
    },

    createAddress: async (payload) => {
        const response = await userApi.post('/addresses', payload);
        return response.data;
    },

    updateAddress: async (addressId, payload) => {
        const response = await userApi.put(`/addresses/${addressId}`, payload);
        return response.data;
    },

    deleteAddress: async (addressId) => {
        const response = await userApi.delete(`/addresses/${addressId}`);
        return response.data;
    },
};

