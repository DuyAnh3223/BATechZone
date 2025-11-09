import { create } from 'zustand';
import { toast } from 'sonner';
import { variantService } from '@/services/variantService';

export const useVariantStore = create((set) => ({
    variants: [],
    currentVariant: null,
    attributes: [],
    mappings: [],
    variantImages: [],
    attributeValues: [], // Attribute values available for product
    loading: false,
    loadingAttributes: false,
    loadingImages: false,
    error: null,

    // Lấy danh sách variants
    fetchVariants: async (params) => {
        set({ loading: true, error: null });
        try {
            const response = await variantService.listVariants(params);
            set({ variants: response.data || response, loading: false });
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Có lỗi xảy ra khi tải danh sách biến thể';
            set({ error: message, loading: false });
            toast.error(message);
            throw error;
        }
    },

    // Lấy variants theo product ID
    fetchVariantsByProductId: async (productId) => {
        set({ loading: true, error: null });
        try {
            const response = await variantService.getVariantsByProductId(productId);
            set({ variants: response.data || response, loading: false });
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Không tải được danh sách biến thể';
            set({ error: message, loading: false });
            toast.error(message);
            throw error;
        }
    },

    // Lấy variant theo ID
    fetchVariant: async (variantId) => {
        set({ loading: true, error: null });
        try {
            const response = await variantService.getVariant(variantId);
            set({ currentVariant: response.data || response, loading: false });
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Có lỗi xảy ra khi tải biến thể';
            set({ error: message, loading: false });
            toast.error(message);
            throw error;
        }
    },

    // Tạo variant mới
    createVariant: async (data) => {
        set({ loading: true, error: null });
        try {
            const response = await variantService.createVariant(data);
            set((state) => ({
                variants: [...state.variants, response.data || response],
                loading: false
            }));
            toast.success('Thêm biến thể thành công!');
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Có lỗi xảy ra khi thêm biến thể';
            set({ error: message, loading: false });
            toast.error(message);
            throw error;
        }
    },

    // Tạo variant cho product
    createVariantForProduct: async (productId, data) => {
        set({ loading: true, error: null });
        try {
            const response = await variantService.createVariantForProduct(productId, data);
            
            // Check if response has success flag
            if (response.success === false) {
                const message = response.message || 'Lưu biến thể thất bại';
                set({ error: message, loading: false });
                toast.error(message);
                throw new Error(message);
            }
            
            // Extract variant data from response
            const newVariant = response.data || response;
            if (newVariant) {
                set((state) => ({
                    variants: [...state.variants, newVariant],
                    loading: false
                }));
                toast.success('Đã thêm biến thể');
            } else {
                // If no data in response, reload variants
                await get().fetchVariantsByProductId(productId);
                toast.success('Đã thêm biến thể');
            }
            return response;
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Lưu biến thể thất bại';
            set({ error: message, loading: false });
            toast.error(message);
            console.error('Error creating variant:', error);
            throw error;
        }
    },

    // Cập nhật variant
    updateVariant: async (variantId, data) => {
        set({ loading: true, error: null });
        try {
            const response = await variantService.updateVariant(variantId, data);
            
            // Check if response has success flag
            if (response.success === false) {
                const message = response.message || 'Lưu biến thể thất bại';
                set({ error: message, loading: false });
                toast.error(message);
                throw new Error(message);
            }
            
            // Extract variant data from response
            const updatedVariant = response.data || response;
            if (updatedVariant) {
                set((state) => ({
                    variants: state.variants.map(v => 
                        v.variant_id === variantId ? updatedVariant : v
                    ),
                    loading: false
                }));
                toast.success('Đã cập nhật biến thể');
            } else {
                // If no data, just show success
                set({ loading: false });
                toast.success('Đã cập nhật biến thể');
            }
            return response;
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Lưu biến thể thất bại';
            set({ error: message, loading: false });
            toast.error(message);
            console.error('Error updating variant:', error);
            throw error;
        }
    },

    // Xóa variant
    deleteVariant: async (variantId) => {
        set({ loading: true, error: null });
        try {
            await variantService.deleteVariant(variantId);
            set((state) => ({
                variants: state.variants.filter(v => v.variant_id !== variantId),
                loading: false
            }));
            toast.success('Đã xóa biến thể');
        } catch (error) {
            const message = error.response?.data?.message || 'Xóa biến thể thất bại';
            set({ error: message, loading: false });
            toast.error(message);
            throw error;
        }
    },

    // Lấy attributes theo product ID
    fetchAttributesByProductId: async (productId) => {
        set({ loadingAttributes: true, error: null });
        try {
            const response = await variantService.getAttributesByProductId(productId);
            set({ attributes: response.data || response, loadingAttributes: false });
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Không tải được thuộc tính';
            set({ error: message, loadingAttributes: false });
            toast.error(message);
            throw error;
        }
    },

    // Lấy mappings theo product ID
    fetchMappingsByProductId: async (productId) => {
        set({ error: null });
        try {
            const response = await variantService.getMappingsByProductId(productId);
            set({ mappings: response.data || response });
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Không tải được mapping';
            set({ error: message });
            toast.error(message);
            throw error;
        }
    },

    // Cập nhật variant mappings
    updateVariantMappings: async (variantId, attributeIds) => {
        set({ loading: true, error: null });
        try {
            const response = await variantService.updateVariantMappings(variantId, attributeIds);
            set({ loading: false });
            toast.success('Đã lưu mapping');
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Lưu mapping thất bại';
            set({ error: message, loading: false });
            toast.error(message);
            throw error;
        }
    },

    // Lấy images theo variant ID
    fetchVariantImages: async (variantId) => {
        set({ loadingImages: true, error: null });
        try {
            const response = await variantService.getVariantImages(variantId);
            set({ variantImages: response.data || response, loadingImages: false });
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Không tải được ảnh biến thể';
            set({ error: message, loadingImages: false });
            toast.error(message);
            throw error;
        }
    },

    // Thêm image cho variant
    addVariantImage: async (variantId, data) => {
        set({ loadingImages: true, error: null });
        try {
            const response = await variantService.addVariantImage(variantId, data);
            set((state) => ({
                variantImages: [...state.variantImages, response.data || response],
                loadingImages: false
            }));
            toast.success('Đã thêm ảnh');
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Thêm ảnh thất bại';
            set({ error: message, loadingImages: false });
            toast.error(message);
            throw error;
        }
    },

    // Upload nhiều images cho variant
    uploadVariantImages: async (variantId, formData) => {
        set({ loadingImages: true, error: null });
        try {
            const response = await variantService.uploadVariantImages(variantId, formData);
            set({ loadingImages: false });
            toast.success('Đã upload ảnh');
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Upload ảnh thất bại';
            set({ error: message, loadingImages: false });
            toast.error(message);
            throw error;
        }
    },

    // Xóa image
    deleteImage: async (imageId) => {
        set({ loadingImages: true, error: null });
        try {
            await variantService.deleteImage(imageId);
            set((state) => ({
                variantImages: state.variantImages.filter(img => img.image_id !== imageId),
                loadingImages: false
            }));
            toast.success('Đã xóa ảnh');
        } catch (error) {
            const message = error.response?.data?.message || 'Xóa ảnh thất bại';
            set({ error: message, loadingImages: false });
            toast.error(message);
            throw error;
        }
    },

    // Lấy attribute values theo product
    fetchAttributeValuesByProduct: async (productId) => {
        set({ loadingAttributes: true, error: null });
        try {
            const response = await variantService.getAttributeValuesByProduct(productId);
            set({ attributeValues: response.data || response, loadingAttributes: false });
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Không tải được danh sách giá trị thuộc tính';
            set({ error: message, loadingAttributes: false });
            toast.error(message);
            throw error;
        }
    },

    // Clear error
    clearError: () => set({ error: null }),

    // Reset state
    reset: () => set({ 
        variants: [], 
        currentVariant: null, 
        attributes: [],
        mappings: [],
        variantImages: [],
        attributeValues: [],
        loading: false, 
        loadingAttributes: false,
        loadingImages: false,
        error: null 
    })
}));