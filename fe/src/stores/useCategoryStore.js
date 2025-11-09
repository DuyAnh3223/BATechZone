import { create } from 'zustand';
import { toast } from 'sonner';
import { categoryService } from '@/services/categoryService';

export const useCategoryStore = create((set, get) => ({
    categories: [],
    parentCategories: [],
    categoryTree: [],
    currentCategory: null,
    total: 0,
    loading: false,
    error: null,

    // Lấy danh sách categories
    fetchCategories: async (params = {}) => {
        set({ loading: true, error: null });
        try {
            const response = await categoryService.listCategories(params);
            set({ 
                categories: response.data || [], 
                total: response.pagination?.total || 0,
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

    // Lấy category theo ID
    fetchCategory: async (categoryId) => {
        set({ loading: true, error: null });
        try {
            const response = await categoryService.getCategory(categoryId);
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

    // Lấy danh sách categories đơn giản (cho parent categories)
    fetchSimpleCategories: async () => {
        try {
            const response = await categoryService.getSimpleCategories();
            set({ parentCategories: response.data || [] });
            return response;
        } catch (error) {
            console.error('Error loading parent categories:', error);
            set({ parentCategories: [] });
            return { data: [] };
        }
    },

    // Lấy category tree
    fetchCategoryTree: async () => {
        try {
            const response = await categoryService.getCategoryTree();
            // Handle different response formats
            const tree = Array.isArray(response) ? response : (response?.data || response || []);
            console.log('Category tree fetched:', tree);
            set({ categoryTree: tree });
            return tree;
        } catch (error) {
            console.error('Error loading category tree:', error);
            console.error('Error details:', error.response?.data);
            set({ categoryTree: [] });
            return [];
        }
    },

    // Tạo category mới
    createCategory: async (data) => {
        set({ loading: true, error: null });
        try {
            const response = await categoryService.createCategory(data);
            toast.success('Thêm danh mục thành công!');
            set({ loading: false });
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Có lỗi xảy ra khi thêm danh mục';
            set({ error: message, loading: false });
            toast.error(message);
            throw error;
        }
    },

    // Cập nhật category
    updateCategory: async (categoryId, data) => {
        set({ loading: true, error: null });
        try {
            const response = await categoryService.updateCategory(categoryId, data);
            toast.success('Cập nhật danh mục thành công!');
            // Cập nhật category trong danh sách nếu có
            set((state) => ({
                categories: state.categories.map(cat =>
                    cat.category_id === parseInt(categoryId) 
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

    // Xóa category
    deleteCategory: async (categoryId) => {
        set({ loading: true, error: null });
        try {
            const idToDelete = parseInt(categoryId);
            const response = await categoryService.deleteCategory(categoryId);
            toast.success('Xóa danh mục thành công!');
            // Cập nhật local state - remove category khỏi danh sách
            set((state) => ({
                categories: state.categories.filter(cat => {
                    // So sánh cả number và string để đảm bảo match chính xác
                    const catId = parseInt(cat.category_id);
                    return catId !== idToDelete;
                }),
                total: Math.max(0, (state.total || 0) - 1),
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

    // Lấy attributes của category
    fetchCategoryAttributes: async (categoryId) => {
        set({ loading: true, error: null });
        try {
            const response = await categoryService.getCategoryAttributes(categoryId);
            set({ loading: false });
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Không thể tải thuộc tính của danh mục';
            set({ error: message, loading: false });
            toast.error(message);
            throw error;
        }
    },

    // Cập nhật attributes cho category
    updateCategoryAttributes: async (categoryId, attributeIds) => {
        set({ loading: true, error: null });
        try {
            const response = await categoryService.updateCategoryAttributes(categoryId, attributeIds);
            toast.success('Cập nhật thuộc tính thành công!');
            set({ loading: false });
            // Refresh current category if it's the one being updated
            if (get().currentCategory?.category_id === categoryId) {
                await get().fetchCategory(categoryId);
            }
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thuộc tính';
            set({ error: message, loading: false });
            toast.error(message);
            throw error;
        }
    },

    // Xóa attribute khỏi category
    removeCategoryAttribute: async (categoryId, attributeId) => {
        set({ loading: true, error: null });
        try {
            const response = await categoryService.removeCategoryAttribute(categoryId, attributeId);
            toast.success('Xóa thuộc tính khỏi danh mục thành công!');
            set({ loading: false });
            // Refresh current category if it's the one being updated
            if (get().currentCategory?.category_id === categoryId) {
                await get().fetchCategory(categoryId);
            }
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Có lỗi xảy ra khi xóa thuộc tính';
            set({ error: message, loading: false });
            toast.error(message);
            throw error;
        }
    },

    // Upload ảnh category
    uploadCategoryImage: async (file) => {
        set({ loading: true, error: null });
        try {
            const response = await categoryService.uploadCategoryImage(file);
            toast.success('Upload ảnh thành công!');
            set({ loading: false });
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Có lỗi xảy ra khi upload ảnh';
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
        parentCategories: [],
        categoryTree: [],
        currentCategory: null,
        total: 0,
        loading: false, 
        error: null 
    })
}));