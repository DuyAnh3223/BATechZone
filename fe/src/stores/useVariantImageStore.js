import { create } from 'zustand';
import { toast } from 'sonner';
import { variantImageService } from '@/services/variantImageService';

export const useVariantImageStore = create((set, get) => ({
    images: [],
    primaryImage: null,
    currentVariantId: null,
    loading: false,
    error: null,

    // Lấy tất cả images của variant
    fetchVariantImages: async (variantId) => {
        set({ loading: true, error: null, currentVariantId: variantId });
        try {
            const response = await variantImageService.getVariantImages(variantId);
            set({ 
                images: response.data || [],
                loading: false 
            });
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Không tải được danh sách hình ảnh';
            set({ error: message, loading: false });
            toast.error(message);
            throw error;
        }
    },

    // Lấy primary image của variant
    fetchPrimaryImage: async (variantId) => {
        set({ loading: true, error: null });
        try {
            const response = await variantImageService.getPrimaryImage(variantId);
            set({ 
                primaryImage: response.data || null,
                loading: false 
            });
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Không tải được hình ảnh chính';
            set({ error: message, loading: false, primaryImage: null });
            // Don't show error toast if no primary image exists (404)
            if (error.response?.status !== 404) {
                toast.error(message);
            }
            throw error;
        }
    },

    // Upload single image
    uploadVariantImage: async (variantId, file, altText = null, isPrimary = false, displayOrder = 0) => {
        set({ loading: true, error: null });
        try {
            const formData = new FormData();
            formData.append('image', file);
            if (altText) formData.append('alt_text', altText);
            formData.append('is_primary', isPrimary);
            formData.append('display_order', displayOrder);

            const response = await variantImageService.uploadVariantImage(variantId, formData);
            
            // Refresh images list
            await get().fetchVariantImages(variantId);
            
            set({ loading: false });
            toast.success('Tải lên hình ảnh thành công');
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Không thể tải lên hình ảnh';
            set({ error: message, loading: false });
            toast.error(message);
            throw error;
        }
    },

    // Bulk upload images (max 10)
    bulkUploadImages: async (variantId, files) => {
        if (!files || files.length === 0) {
            toast.error('Vui lòng chọn ít nhất một hình ảnh');
            return;
        }

        if (files.length > 10) {
            toast.error('Chỉ có thể tải lên tối đa 10 hình ảnh cùng lúc');
            return;
        }

        set({ loading: true, error: null });
        try {
            const formData = new FormData();
            files.forEach((file) => {
                formData.append('images', file);
            });

            const response = await variantImageService.bulkUploadImages(variantId, formData);
            
            // Refresh images list
            await get().fetchVariantImages(variantId);
            
            set({ loading: false });
            toast.success(`Đã tải lên ${files.length} hình ảnh thành công`);
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Không thể tải lên hình ảnh';
            set({ error: message, loading: false });
            toast.error(message);
            throw error;
        }
    },

    // Set image làm primary
    setPrimaryImage: async (imageId, variantId) => {
        set({ loading: true, error: null });
        try {
            const response = await variantImageService.setPrimaryImage(imageId);
            
            // Refresh images list
            await get().fetchVariantImages(variantId);
            
            set({ loading: false });
            toast.success('Đã đặt làm hình ảnh chính');
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Không thể đặt làm hình ảnh chính';
            set({ error: message, loading: false });
            toast.error(message);
            throw error;
        }
    },

    // Update image metadata
    updateImageMetadata: async (imageId, variantId, data) => {
        set({ loading: true, error: null });
        try {
            const response = await variantImageService.updateImageMetadata(imageId, data);
            
            // Refresh images list
            await get().fetchVariantImages(variantId);
            
            set({ loading: false });
            toast.success('Cập nhật thông tin hình ảnh thành công');
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Không thể cập nhật thông tin hình ảnh';
            set({ error: message, loading: false });
            toast.error(message);
            throw error;
        }
    },

    // Xóa image
    deleteVariantImage: async (imageId, variantId) => {
        set({ loading: true, error: null });
        try {
            const response = await variantImageService.deleteVariantImage(imageId);
            
            // Refresh images list
            await get().fetchVariantImages(variantId);
            
            set({ loading: false });
            toast.success('Xóa hình ảnh thành công');
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Không thể xóa hình ảnh';
            set({ error: message, loading: false });
            toast.error(message);
            throw error;
        }
    },

    // Clear state
    clearImages: () => {
        set({
            images: [],
            primaryImage: null,
            currentVariantId: null,
            error: null
        });
    }
}));
