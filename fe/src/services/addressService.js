import api from '@/lib/axios';

export const addressService = {
    getAddresses: async () => {
        const response = await api.get('/addresses');
        return response.data;
    },

    getAddressById: async (addressId) => {
        const response = await api.get(`/addresses/${addressId}`);
        return response.data;
    },

    createAddress: async (payload) => {
        const response = await api.post('/addresses', payload);
        return response.data;
    },

    updateAddress: async (addressId, payload) => {
        const response = await api.put(`/addresses/${addressId}`, payload);
        return response.data;
    },

    deleteAddress: async (addressId) => {
        const response = await api.delete(`/addresses/${addressId}`);
        return response.data;
    },
};
