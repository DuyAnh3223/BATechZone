import { create } from 'zustand';
import { toast } from 'sonner';
import { productService } from '@/services/productService';

export const useProductStore = create((set, get) => ({
    products: [],
    currentProduct: null,
    total: 0,
    loading: false,
    error: null,

    // Lấy danh sách products
    fetchProducts: async (params = {}) => {
        set({ loading: true, error: null });
        try {
            const response = await productService.listProducts(params);
            set({ 
                products: response.data || [], 
                total: response.pagination?.total || 0,
                loading: false 
            });
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Không tải được danh sách sản phẩm';
            set({ error: message, loading: false });
            toast.error(message);
            throw error;
        }
    },

    // Lấy product theo ID
    fetchProduct: async (productId) => {
        set({ loading: true, error: null });
        try {
            const response = await productService.getProduct(productId);
            set({ 
                currentProduct: response.data || response, 
                loading: false 
            });
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Không thể tải thông tin sản phẩm';
            set({ error: message, loading: false });
            toast.error(message);
            throw error;
        }
    },

    // Tạo product mới
    createProduct: async (data) => {
        set({ loading: true, error: null });
        try {
            const response = await productService.createProduct(data);
            toast.success('Thêm sản phẩm thành công!');
            set({ loading: false });
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Có lỗi xảy ra khi thêm sản phẩm';
            set({ error: message, loading: false });
            toast.error(message);
            throw error;
        }
    },

    // Cập nhật product
    updateProduct: async (productId, data) => {
        set({ loading: true, error: null });
        try {
            const response = await productService.updateProduct(productId, data);
            toast.success('Cập nhật sản phẩm thành công!');
            set((state) => ({
                products: state.products.map(p => 
                    p.product_id === parseInt(productId) 
                        ? (response.data || p) 
                        : p
                ),
                currentProduct: response.data || state.currentProduct,
                loading: false
            }));
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật sản phẩm';
            set({ error: message, loading: false });
            toast.error(message);
            throw error;
        }
    },

    // Xóa product
    deleteProduct: async (productId) => {
        set({ loading: true, error: null });
        try {
            const response = await productService.deleteProduct(productId);
            toast.success('Xóa sản phẩm thành công!');
            set((state) => ({
                products: state.products.filter(p => p.product_id !== parseInt(productId)),
                total: Math.max(0, (state.total || 0) - 1),
                loading: false
            }));
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Có lỗi xảy ra khi xóa sản phẩm';
            set({ error: message, loading: false });
            toast.error(message);
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
    reset: () => set({ 
        products: [], 
        currentProduct: null,
        total: 0,
        loading: false, 
        error: null 
    })
}));