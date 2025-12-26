import { userApi, adminApi } from '@/lib/axios';

/**
 * Service Request Service - Warranty claim requests (User + Admin)
 */

// ============ USER METHODS ============

export const serviceRequestService = {
    // Lấy danh sách sản phẩm đã mua của user (có thể yêu cầu bảo hành)
    getMyProducts: async () => {
        const response = await userApi.get('/service-requests/my-products');
        return response.data;
    },

    // Tạo yêu cầu bảo hành mới
    createRequest: async (data) => {
        const response = await userApi.post('/service-requests', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    // Lấy danh sách yêu cầu bảo hành của user
    getMyRequests: async (params = {}) => {
        const response = await userApi.get('/service-requests/my-requests', { params });
        return response.data;
    },

    // Lấy chi tiết 1 yêu cầu bảo hành
    getRequestDetail: async (requestId) => {
        const response = await userApi.get(`/service-requests/${requestId}`);
        return response.data;
    },

    // Hủy yêu cầu bảo hành
    cancelRequest: async (requestId, reason) => {
        const response = await userApi.patch(`/service-requests/${requestId}/cancel`, { reason });
        return response.data;
    }
};

// ============ PUBLIC METHODS (No Auth Required) ============

// Search product by serial or phone for walk-in customers (Public)
export const searchProductForWarranty = async (searchType, searchValue) => {
    const params = searchType === 'serial' 
        ? { serial: searchValue }
        : { phone: searchValue };
    
    const response = await userApi.get('/service-requests/public/search-product', { params });
    return response.data;
};

// ============ ADMIN METHODS ============

// Create warranty request for walk-in customer (Public)
export const createWalkInWarrantyRequest = async (formData) => {
    const response = await userApi.post('/service-requests/public/walk-in', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// Get all warranty requests with filters
export const getAllWarrantyRequests = async (filters = {}) => {
    const response = await adminApi.get('/service-requests/admin/requests', { params: filters });
    return response.data;
};

// Get warranty request detail
export const getWarrantyRequestDetail = async (requestId) => {
    const response = await adminApi.get(`/service-requests/admin/requests/${requestId}`);
    return response.data;
};

// Update warranty request status
export const updateWarrantyStatus = async (requestId, statusData) => {
    const response = await adminApi.patch(`/service-requests/admin/requests/${requestId}/status`, statusData);
    return response.data;
};

// Inspect and evaluate warranty request
export const inspectWarrantyRequest = async (requestId, inspectionData) => {
    const response = await adminApi.post(`/service-requests/admin/requests/${requestId}/inspect`, inspectionData);
    return response.data;
};

// Update priority
export const updateWarrantyPriority = async (requestId, priority) => {
    const response = await adminApi.patch(`/service-requests/admin/requests/${requestId}/priority`, { priority });
    return response.data;
};

// Add admin note
export const addAdminNote = async (requestId, note) => {
    const response = await adminApi.post(`/service-requests/admin/requests/${requestId}/notes`, { note });
    return response.data;
};

// Send SMS notification
export const sendWarrantySMS = async (requestId, message) => {
    const response = await adminApi.post(`/service-requests/admin/requests/${requestId}/sms`, { message });
    return response.data;
};

// Export warranty data
export const exportWarrantyData = async (filters = {}) => {
    const response = await adminApi.get('/service-requests/admin/export', { 
        params: filters,
        responseType: 'blob'
    });
    return response.data;
};

// Get warranty statistics
export const getWarrantyStatistics = async (dateRange = {}) => {
    const response = await adminApi.get('/service-requests/admin/statistics', { params: dateRange });
    return response.data;
};
