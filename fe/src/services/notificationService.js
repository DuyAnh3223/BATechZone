import api from '@/lib/axios';

export const notificationService = {
    // Lấy danh sách thông báo của user hiện tại
    getNotifications: async (params = {}) => {
        try {
            const response = await api.get('/notifications', { 
                params,
                withCredentials: true 
            });
            return response.data;
        } catch (error) {
            // Nếu API chưa có, trả về empty array
            if (error.response?.status === 404) {
                return { success: true, data: [], total: 0, unreadCount: 0 };
            }
            throw error;
        }
    },

    // Đánh dấu thông báo là đã đọc
    markAsRead: async (notificationId) => {
        try {
            const response = await api.put(`/notifications/${notificationId}/read`, {}, { 
                withCredentials: true 
            });
            return response.data;
        } catch (error) {
            // Nếu API chưa có, trả về success
            if (error.response?.status === 404) {
                return { success: true };
            }
            throw error;
        }
    },

    // Đánh dấu tất cả thông báo là đã đọc
    markAllAsRead: async () => {
        try {
            const response = await api.put('/notifications/read-all', {}, { 
                withCredentials: true 
            });
            return response.data;
        } catch (error) {
            // Nếu API chưa có, trả về success
            if (error.response?.status === 404) {
                return { success: true };
            }
            throw error;
        }
    },

    // Xóa thông báo
    deleteNotification: async (notificationId) => {
        try {
            const response = await api.delete(`/notifications/${notificationId}`, { 
                withCredentials: true 
            });
            return response.data;
        } catch (error) {
            // Nếu API chưa có, trả về success
            if (error.response?.status === 404) {
                return { success: true };
            }
            throw error;
        }
    },

    // Lấy số lượng thông báo chưa đọc
    getUnreadCount: async () => {
        try {
            const response = await api.get('/notifications/unread-count', { 
                withCredentials: true 
            });
            return response.data;
        } catch (error) {
            // Nếu API chưa có, trả về 0
            if (error.response?.status === 404) {
                return { success: true, count: 0 };
            }
            throw error;
        }
    }
};

