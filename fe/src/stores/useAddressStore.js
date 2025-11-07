import { create } from 'zustand';
import { toast } from 'sonner';
import { addressService } from '@/services/addressService';

export const useUserAddressStore = create((set, get) => ({
    addresses: [],
    selectedAddress: null,
    loading: false,
    error: null,

    fetchAddresses: async () => {
        try {
            set({ loading: true, error: null });
            const response = await addressService.getAddresses();
            if (response?.success) {
                set({ addresses: response.data, loading: false });
            } else {
                set({ addresses: [], loading: false });
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Không thể lấy danh sách địa chỉ';
            set({ loading: false, error: message });
            toast.error(message);
            throw error;
        }
    },

    fetchAddressById: async (addressId) => {
        try {
            set({ loading: true, error: null });
            const response = await addressService.getAddressById(addressId);
            if (response?.success) {
                set({ selectedAddress: response.data, loading: false });
                return response.data;
            }
            set({ loading: false });
            return null;
        } catch (error) {
            const message = error.response?.data?.message || 'Không thể lấy thông tin địa chỉ';
            set({ loading: false, error: message });
            toast.error(message);
            throw error;
        }
    },

    addAddress: async (payload) => {
        try {
            set({ loading: true, error: null });
            const response = await addressService.createAddress(payload);
            if (response?.success) {
                set({
                    addresses: [response.data, ...get().addresses],
                    loading: false,
                });
                toast.success('Thêm địa chỉ thành công');
                return response.data;
            }
            set({ loading: false });
            return null;
        } catch (error) {
            const message = error.response?.data?.message || 'Không thể thêm địa chỉ';
            set({ loading: false, error: message });
            toast.error(message);
            throw error;
        }
    },

    updateAddress: async (addressId, payload) => {
        try {
            set({ loading: true, error: null });
            const response = await addressService.updateAddress(addressId, payload);
            if (response?.success) {
                const updatedAddress = response.data;
                set({
                    addresses: get().addresses.map((addr) =>
                        addr.address_id === updatedAddress.address_id ? updatedAddress : addr
                    ),
                    selectedAddress:
                        get().selectedAddress?.address_id === updatedAddress.address_id
                            ? updatedAddress
                            : get().selectedAddress,
                    loading: false,
                });
                toast.success('Cập nhật địa chỉ thành công');
                return updatedAddress;
            }
            set({ loading: false });
            return null;
        } catch (error) {
            const message = error.response?.data?.message || 'Không thể cập nhật địa chỉ';
            set({ loading: false, error: message });
            toast.error(message);
            throw error;
        }
    },

    removeAddress: async (addressId) => {
        try {
            set({ loading: true, error: null });
            const response = await addressService.deleteAddress(addressId);
            if (response?.success) {
                set({
                    addresses: get().addresses.filter((addr) => addr.address_id !== addressId),
                    selectedAddress:
                        get().selectedAddress?.address_id === addressId ? null : get().selectedAddress,
                    loading: false,
                });
                toast.success('Xóa địa chỉ thành công');
                return true;
            }
            set({ loading: false });
            return false;
        } catch (error) {
            const message = error.response?.data?.message || 'Không thể xóa địa chỉ';
            set({ loading: false, error: message });
            toast.error(message);
            throw error;
        }
    },

    setSelectedAddress: (address) => set({ selectedAddress: address }),

    clearAddresses: () => set({ addresses: [], selectedAddress: null, error: null }),
}));
