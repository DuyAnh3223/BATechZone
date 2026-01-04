import { create } from 'zustand';
import { toast } from 'sonner';
import { categoryService } from '@/services/categoryService';

export const useCategoryStore = create((set, get) => ({
    categories: [],
    currentCategory: null,
    loading: false,
    error: null,

    // Lấy tất cả danh mục
    fetchCategories: async () => {
        set({ loading: true, error: null });
        try {
            const response = await categoryService.getAllCategories();
            set({ 
                categories: response.data || [], 
                loading: false 
            });
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Không tải được danh sách danh mục';
            set({ error: message, loading: false });
            toast.error(message);
            throw error;
        }
    },

    // Lấy danh mục theo ID
    fetchCategory: async (categoryId) => {
        set({ loading: true, error: null });
        try {
            const response = await categoryService.getCategoryById(categoryId);
            set({ 
                currentCategory: response.data || response, 
                loading: false 
            });
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Không thể tải thông tin danh mục';
            set({ error: message, loading: false });
            toast.error(message);
            throw error;
        }
    },

    // Tạo danh mục mới
    createCategory: async (data, imageFile = null) => {
        set({ loading: true, error: null });
        try {
            const response = await categoryService.createCategory(data, imageFile);
            toast.success('Tạo danh mục thành công!');
            set({ loading: false });
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Có lỗi xảy ra khi thêm danh mục';
            set({ error: message, loading: false });
            toast.error(message);
            throw error;
        }
    },

    // Cập nhật danh mục
    updateCategory: async (categoryId, data, imageFile = null) => {
        set({ loading: true, error: null });
        try {
            const response = await categoryService.updateCategory(categoryId, data, imageFile);
            toast.success('Cập nhật danh mục thành công!');
            // Cập nhật category trong danh sách nếu có
            set((state) => ({
                categories: state.categories.map(cat =>
                    cat.id === parseInt(categoryId) 
                        ? (response.data || cat) 
                        : cat
                ),
                currentCategory: response.data || state.currentCategory,
                loading: false
            }));
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật danh mục';
            set({ error: message, loading: false });
            toast.error(message);
            throw error;
        }
    },

    // Xóa danh mục
    deleteCategory: async (categoryId) => {
        set({ loading: true, error: null });
        try {
            const idToDelete = parseInt(categoryId);
            const response = await categoryService.deleteCategory(categoryId);
            toast.success('Xóa danh mục thành công!');
            // Cập nhật local state - remove category khỏi danh sách
            set((state) => ({
                categories: state.categories.filter(cat => {
                    const catId = parseInt(cat.id || cat.category_id);
                    return catId !== idToDelete;
                }),
                loading: false
            }));
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Có lỗi xảy ra khi xóa danh mục';
            set({ error: message, loading: false });
            toast.error(message);
            throw error;
        }
    },

    // ========== QUẢN LÝ THUỘC TÍNH ==========

    // Lấy danh sách thuộc tính của danh mục
    fetchCategoryAttributes: async (categoryId) => {
        set({ loading: true, error: null });
        try {
            const response = await categoryService.getAttributesByCategory(categoryId);
            set({ loading: false });
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Không thể tải thuộc tính của danh mục';
            set({ error: message, loading: false });
            toast.error(message);
            throw error;
        }
    },

    // Thêm thuộc tính mới cho danh mục
    createAttributeForCategory: async (categoryId, attributeName, isVariantAttribute = 0) => {
        set({ loading: true, error: null });
        try {
            const response = await categoryService.createAttributeForCategory(categoryId, attributeName, isVariantAttribute);
            toast.success('Thêm thuộc tính thành công!');
            set({ loading: false });
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Có lỗi xảy ra khi thêm thuộc tính';
            set({ error: message, loading: false });
            toast.error(message);
            throw error;
        }
    },

    // Xóa thuộc tính khỏi danh mục
    deleteAttributeForCategory: async (categoryId, attributeId) => {
        set({ loading: true, error: null });
        try {
            const response = await categoryService.deleteAttributeForCategory(categoryId, attributeId);
            toast.success('Xóa thuộc tính thành công!');
            set({ loading: false });
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Có lỗi xảy ra khi xóa thuộc tính';
            set({ error: message, loading: false });
            toast.error(message);
            throw error;
        }
    },

    // Cập nhật isVariant cho thuộc tính
    updateAttributeIsVariant: async (categoryId, attributeId, isVariant) => {
        try {
            const response = await categoryService.updateAttributeIsVariant(categoryId, attributeId, isVariant);
            toast.success(`Đã ${isVariant === 1 ? 'bật' : 'tắt'} thuộc tính biến thể`);
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thuộc tính';
            toast.error(message);
            throw error;
        }
    },

    // ========== QUẢN LÝ GIÁ TRỊ THUỘC TÍNH ==========

    // Lấy giá trị thuộc tính
    fetchAttributeValues: async (categoryId, attributeId) => {
        set({ loading: true, error: null });
        try {
            const response = await categoryService.getAttributeValuesForCategory(categoryId, attributeId);
            set({ loading: false });
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Không thể tải giá trị thuộc tính';
            set({ error: message, loading: false });
            toast.error(message);
            throw error;
        }
    },

    // Thêm giá trị thuộc tính mới
    createAttributeValueForCategory: async (categoryId, attributeId, valueName) => {
        set({ loading: true, error: null });
        try {
            const response = await categoryService.createAttributeValueForCategory(categoryId, attributeId, valueName);
            toast.success('Thêm giá trị thuộc tính thành công!');
            set({ loading: false });
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Có lỗi xảy ra khi thêm giá trị';
            set({ error: message, loading: false });
            toast.error(message);
            throw error;
        }
    },

    // Xóa giá trị thuộc tính
    deleteAttributeValueForCategory: async (categoryId, attributeId, valueId) => {
        set({ loading: true, error: null });
        try {
            const response = await categoryService.deleteAttributeValueForCategory(categoryId, attributeId, valueId);
            toast.success('Xóa giá trị thuộc tính thành công!');
            set({ loading: false });
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
        categories: [], 
        currentCategory: null,
        loading: false, 
        error: null 
    })
}));