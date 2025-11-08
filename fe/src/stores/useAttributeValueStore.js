import { create } from 'zustand';
import { toast } from 'sonner';
import { attributeValueService } from '@/services/attributeValueService';

export const useAttributeValueStore = create((set, get) => ({
    attributeValues: [],
    currentValues: [],
    loading: false,
    error: null,

    // Lấy danh sách tất cả attribute values
    fetchAttributeValues: async (params = {}) => {
        set({ loading: true, error: null });
        try {
            const response = await attributeValueService.listAttributeValues(params);
            set({ 
                attributeValues: response.data || [], 
                loading: false 
            });
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Không tải được danh sách giá trị';
            set({ error: message, loading: false });
            toast.error(message);
            throw error;
        }
    },

    // Lấy các values của một attribute cụ thể
    fetchAttributeValuesByAttributeId: async (attributeId) => {
        set({ loading: true, error: null });
        try {
            const response = await attributeValueService.getAttributeValues(attributeId);
            const values = Array.isArray(response) ? response : (response.data || []);
            set({ 
                currentValues: values, 
                loading: false 
            });
            return values;
        } catch (error) {
            const message = error.response?.data?.message || 'Không tải được danh sách giá trị';
            set({ error: message, loading: false, currentValues: [] });
            toast.error(message);
            throw error;
        }
    },

    // Tạo attribute value mới
    createAttributeValue: async (valueData) => {
        set({ loading: true, error: null });
        try {
            const response = await attributeValueService.createAttributeValue(valueData);
            toast.success('Thêm giá trị thành công!');
            set({ loading: false });
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Có lỗi xảy ra khi thêm giá trị';
            set({ error: message, loading: false });
            toast.error(message);
            throw error;
        }
    },

    // Cập nhật attribute value
    updateAttributeValue: async (valueId, valueData) => {
        set({ loading: true, error: null });
        try {
            const response = await attributeValueService.updateAttributeValue(valueId, valueData);
            toast.success('Cập nhật giá trị thành công!');
            set((state) => ({
                currentValues: state.currentValues.map(val => 
                    val.attribute_value_id === parseInt(valueId) 
                        ? (response || val) 
                        : val
                ),
                loading: false
            }));
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật giá trị';
            set({ error: message, loading: false });
            toast.error(message);
            throw error;
        }
    },

    // Xóa attribute value
    deleteAttributeValue: async (valueId) => {
        set({ loading: true, error: null });
        try {
            const response = await attributeValueService.deleteAttributeValue(valueId);
            toast.success('Xóa giá trị thành công!');
            set((state) => ({
                currentValues: state.currentValues.filter(val => 
                    val.attribute_value_id !== parseInt(valueId)
                ),
                loading: false
            }));
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Có lỗi xảy ra khi xóa giá trị';
            set({ error: message, loading: false });
            toast.error(message);
            throw error;
        }
    },

    // Clear error
    clearError: () => set({ error: null }),

    // Reset state
    reset: () => set({ 
        attributeValues: [], 
        currentValues: [], 
        loading: false, 
        error: null 
    })
}));