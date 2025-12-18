import { userApi } from '@/lib/axios';

export const notificationService = {
    // Láº¥y danh sÃ¡ch thÃ´ng bÃ¡o cá»§a user hiá»‡n táº¡i
    getNotifications: async (params = {}) => {
        try {
            const response = await userApi.get('/notifications', { 
                params,
                withCredentials: true 
            });
            return response.data;
        } catch (error) {
            // Náº¿u API chÆ°a cÃ³, tráº£ vá» empty array
            if (error.response?.status === 404) {
                return { success: true, data: [], total: 0, unreadCount: 0 };
            }
            throw error;
        }
    },

    // ÄÃ¡nh dáº¥u thÃ´ng bÃ¡o lÃ  Ä‘Ã£ Ä‘á»c
    markAsRead: async (notificationId) => {
        try {
            const response = await userApi.put(`/notifications/${notificationId}/read`, {}, { 
                withCredentials: true 
            });
            return response.data;
        } catch (error) {
            // Náº¿u API chÆ°a cÃ³, tráº£ vá» success
            if (error.response?.status === 404) {
                return { success: true };
            }
            throw error;
        }
    },

    // ÄÃ¡nh dáº¥u táº¥t cáº£ thÃ´ng bÃ¡o lÃ  Ä‘Ã£ Ä‘á»c
    markAllAsRead: async () => {
        try {
            const response = await userApi.put('/notifications/read-all', {}, { 
                withCredentials: true 
            });
            return response.data;
        } catch (error) {
            // Náº¿u API chÆ°a cÃ³, tráº£ vá» success
            if (error.response?.status === 404) {
                return { success: true };
            }
            throw error;
        }
    },

    // XÃ³a thÃ´ng bÃ¡o
    deleteNotification: async (notificationId) => {
        try {
            const response = await userApi.delete(`/notifications/${notificationId}`, { 
                withCredentials: true 
            });
            return response.data;
        } catch (error) {
            // Náº¿u API chÆ°a cÃ³, tráº£ vá» success
            if (error.response?.status === 404) {
                return { success: true };
            }
            throw error;
        }
    },

    // Láº¥y sá»‘ lÆ°á»£ng thÃ´ng bÃ¡o chÆ°a Ä‘á»c
    getUnreadCount: async () => {
        try {
            const response = await userApi.get('/notifications/unread-count', { 
                withCredentials: true 
            });
            return response.data;
        } catch (error) {
            // Náº¿u API chÆ°a cÃ³, tráº£ vá» 0
            if (error.response?.status === 404) {
                return { success: true, count: 0 };
            }
            throw error;
        }
    }
};


