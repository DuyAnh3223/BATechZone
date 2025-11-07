import { create } from 'zustand';
import { productService } from '@/services/productService';

export const useProductStore = create((set) => ({
    products: [],
    currentProduct: null,
    loading: false,
    error: null,

    // Lấy danh sách products
    fetchProducts: async (params) => {
        set({ loading: true, error: null });
        try {
            const response = await productService.listProducts(params);
            set({ products: response.data || response, loading: false });
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Lấy product theo ID
    fetchProduct: async (productId) => {
        set({ loading: true, error: null });
        try {
            const response = await productService.getProduct(productId);
            set({ currentProduct: response.data || response, loading: false });
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Tạo product mới
    createProduct: async (data) => {
        set({ loading: true, error: null });
        try {
            const response = await productService.createProduct(data);
            set((state) => ({
                products: [...state.products, response.data || response],
                loading: false
            }));
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Cập nhật product
    updateProduct: async (productId, data) => {
        set({ loading: true, error: null });
        try {
            const response = await productService.updateProduct(productId, data);
            set((state) => ({
                products: state.products.map(p => 
                    p.product_id === productId ? (response.data || response) : p
                ),
                loading: false
            }));
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Xóa product
    deleteProduct: async (productId) => {
        set({ loading: true, error: null });
        try {
            const response = await productService.deleteProduct(productId);
            set((state) => ({
                products: state.products.filter(p => p.product_id !== productId),
                loading: false
            }));
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Tăng lượt xem product
    increaseView: async (productId) => {
        try {
            const response = await productService.increaseProductView(productId);
            return response;
        } catch (error) {
            console.error('Error increasing view:', error);
            throw error;
        }
    },

    // Clear error
    clearError: () => set({ error: null }),

    // Reset state
    reset: () => set({ products: [], currentProduct: null, loading: false, error: null })
}));