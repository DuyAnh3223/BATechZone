import { create } from 'zustand';
import { toast } from 'sonner';
import { bundleService } from '@/services/bundleService';

/**
 * Zustand Store for User Bundle Management
 * Handles bundle listing, detail view, and stock checking for end users
 */
export const useUserBundleStore = create((set, get) => ({
    // ==================== STATE ====================
    bundles: [],
    currentBundle: null,
    bundleStock: null,
    pagination: null,
    total: 0,
    loading: false,
    error: null,

    // ==================== USER ACTIONS ====================
    
    /**
     * Lấy danh sách bundles (cho user)
     * @param {Object} params - Query parameters (search, min_price, max_price, sort_by, etc.)
     */
    fetchBundles: async (params = {}) => {
        set({ loading: true, error: null });
        try {
            const response = await bundleService.listBundles(params);
            
            const bundles = response.data || [];
            const pagination = response.pagination || null;
            const total = pagination?.total || bundles.length;
            
            set({ 
                bundles: bundles, 
                pagination: pagination,
                total: total,
                loading: false 
            });
            
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Không tải được danh sách bundle';
            set({ error: message, loading: false });
            toast.error(message);
            throw error;
        }
    },

    /**
     * Lấy chi tiết bundle
     * @param {number} variantId - Bundle variant ID
     */
    fetchBundleDetail: async (variantId) => {
        set({ loading: true, error: null });
        try {
            const response = await bundleService.getBundle(variantId);
            
            set({ 
                currentBundle: response.data,
                loading: false 
            });
            
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Không tải được chi tiết bundle';
            set({ error: message, loading: false, currentBundle: null });
            toast.error(message);
            throw error;
        }
    },

    /**
     * Kiểm tra tồn kho bundle
     * @param {number} variantId - Bundle variant ID
     */
    checkBundleStock: async (variantId) => {
        try {
            const response = await bundleService.checkStock(variantId);
            
            set({ bundleStock: response.data });
            
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Không kiểm tra được tồn kho';
            toast.error(message);
            throw error;
        }
    },

    /**
     * Reset current bundle (khi rời khỏi trang chi tiết)
     */
    clearCurrentBundle: () => {
        set({ currentBundle: null, bundleStock: null });
    },

    /**
     * Reset toàn bộ store
     */
    reset: () => {
        set({
            bundles: [],
            currentBundle: null,
            bundleStock: null,
            pagination: null,
            total: 0,
            loading: false,
            error: null
        });
    }
}));

/**
 * Zustand Store for Admin Bundle Management
 * Handles CRUD operations for bundles (Admin only)
 */
export const useAdminBundleStore = create((set, get) => ({
    // ==================== STATE ====================
    bundles: [],
    currentBundle: null,
    pagination: null,
    total: 0,
    loading: false,
    error: null,

    // ==================== ADMIN ACTIONS ====================
    
    /**
     * Lấy danh sách bundles (Admin)
     * @param {Object} params - Query parameters
     */
    fetchAdminBundles: async (params = {}) => {
        set({ loading: true, error: null });
        try {
            const response = await bundleService.listAdminBundles(params);
            
            const bundles = response.data || [];
            const pagination = response.pagination || null;
            const total = pagination?.total || bundles.length;
            
            set({ 
                bundles: bundles, 
                pagination: pagination,
                total: total,
                loading: false 
            });
            
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Không tải được danh sách bundle';
            set({ error: message, loading: false });
            toast.error(message);
            throw error;
        }
    },

    /**
     * Lấy chi tiết bundle (Admin)
     * @param {number} variantId - Bundle variant ID
     */
    fetchAdminBundleDetail: async (variantId) => {
        set({ loading: true, error: null });
        try {
            const response = await bundleService.getAdminBundle(variantId);
            
            set({ 
                currentBundle: response.data,
                loading: false 
            });
            
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Không tải được chi tiết bundle';
            set({ error: message, loading: false, currentBundle: null });
            toast.error(message);
            throw error;
        }
    },

    /**
     * Tạo bundle mới (Admin)
     * @param {Object} bundleData - Bundle data
     */
    createBundle: async (bundleData) => {
        set({ loading: true, error: null });
        try {
            const response = await bundleService.createBundle(bundleData);
            
            // Thêm bundle mới vào danh sách
            set(state => ({
                bundles: [response.data, ...state.bundles],
                total: state.total + 1,
                loading: false
            }));
            
            toast.success(response.message || 'Tạo bundle thành công!');
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Không tạo được bundle';
            set({ error: message, loading: false });
            toast.error(message);
            throw error;
        }
    },

    /**
     * Cập nhật bundle (Admin)
     * @param {number} variantId - Bundle variant ID
     * @param {Object} bundleData - Bundle data to update
     */
    updateBundle: async (variantId, bundleData) => {
        set({ loading: true, error: null });
        try {
            const response = await bundleService.updateBundle(variantId, bundleData);
            
            // Cập nhật bundle trong danh sách
            set(state => ({
                bundles: state.bundles.map(bundle => 
                    bundle.variant_id === variantId ? response.data : bundle
                ),
                currentBundle: state.currentBundle?.variant_id === variantId 
                    ? response.data 
                    : state.currentBundle,
                loading: false
            }));
            
            toast.success(response.message || 'Cập nhật bundle thành công!');
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Không cập nhật được bundle';
            set({ error: message, loading: false });
            toast.error(message);
            throw error;
        }
    },

    /**
     * Xóa bundle (Admin - Soft delete)
     * @param {number} variantId - Bundle variant ID
     */
    deleteBundle: async (variantId) => {
        set({ loading: true, error: null });
        try {
            const response = await bundleService.deleteBundle(variantId);
            
            // Xóa bundle khỏi danh sách
            set(state => ({
                bundles: state.bundles.filter(bundle => bundle.variant_id !== variantId),
                total: state.total - 1,
                loading: false
            }));
            
            toast.success(response.message || 'Xóa bundle thành công!');
            return response;
        } catch (error) {
            const message = error.response?.data?.message || 'Không xóa được bundle';
            set({ error: message, loading: false });
            toast.error(message);
            throw error;
        }
    },

    /**
     * Reset current bundle
     */
    clearCurrentBundle: () => {
        set({ currentBundle: null });
    },

    /**
     * Reset toàn bộ store
     */
    reset: () => {
        set({
            bundles: [],
            currentBundle: null,
            pagination: null,
            total: 0,
            loading: false,
            error: null
        });
    }
}));
