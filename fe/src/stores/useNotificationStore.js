import { create } from 'zustand';
import { toast } from 'sonner';
import { notificationService } from '@/services/notificationService';

export const useNotificationStore = create((set, get) => ({
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,

    // Lấy danh sách thông báo
    fetchNotifications: async (params = {}) => {
        set({ loading: true, error: null });
        try {
            const response = await notificationService.getNotifications(params);
            const notifications = response.data || response || [];
            const unreadCount = response.unreadCount || notifications.filter(n => !n.is_read).length || 0;
            
            set({ 
                notifications,
                unreadCount,
                loading: false 
            });
            return response;
        } catch (error) {
            console.error('Error fetching notifications:', error);
            // Không hiển thị toast error nếu API chưa có
            if (error.response?.status !== 404) {
                const message = error.response?.data?.message || 'Không tải được thông báo';
                set({ error: message, loading: false });
                toast.error(message);
            } else {
                set({ notifications: [], unreadCount: 0, loading: false });
            }
            return { data: [], unreadCount: 0 };
        }
    },

    // Lấy số lượng thông báo chưa đọc
    fetchUnreadCount: async () => {
        try {
            const response = await notificationService.getUnreadCount();
            const count = response.count || response.data?.count || 0;
            set({ unreadCount: count });
            return count;
        } catch (error) {
            console.error('Error fetching unread count:', error);
            // Không hiển thị error nếu API chưa có
            if (error.response?.status !== 404) {
                console.error('Failed to fetch unread count:', error);
            }
            set({ unreadCount: 0 });
            return 0;
        }
    },

    // Đánh dấu thông báo là đã đọc
    markAsRead: async (notificationId) => {
        try {
            await notificationService.markAsRead(notificationId);
            // Cập nhật local state
            set((state) => ({
                notifications: state.notifications.map(notif =>
                    notif.notification_id === notificationId || notif.id === notificationId
                        ? { ...notif, is_read: true, read_at: new Date().toISOString() }
                        : notif
                ),
                unreadCount: Math.max(0, state.unreadCount - 1)
            }));
        } catch (error) {
            console.error('Error marking notification as read:', error);
            if (error.response?.status !== 404) {
                toast.error('Không thể đánh dấu thông báo là đã đọc');
            }
        }
    },

    // Đánh dấu tất cả thông báo là đã đọc
    markAllAsRead: async () => {
        try {
            await notificationService.markAllAsRead();
            // Cập nhật local state
            set((state) => ({
                notifications: state.notifications.map(notif => ({
                    ...notif,
                    is_read: true,
                    read_at: new Date().toISOString()
                })),
                unreadCount: 0
            }));
            toast.success('Đã đánh dấu tất cả thông báo là đã đọc');
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            if (error.response?.status !== 404) {
                toast.error('Không thể đánh dấu tất cả thông báo là đã đọc');
            }
        }
    },

    // Xóa thông báo
    deleteNotification: async (notificationId) => {
        try {
            await notificationService.deleteNotification(notificationId);
            // Cập nhật local state
            set((state) => {
                const notif = state.notifications.find(n => 
                    n.notification_id === notificationId || n.id === notificationId
                );
                return {
                    notifications: state.notifications.filter(n =>
                        n.notification_id !== notificationId && n.id !== notificationId
                    ),
                    unreadCount: notif && !notif.is_read 
                        ? Math.max(0, state.unreadCount - 1) 
                        : state.unreadCount
                };
            });
        } catch (error) {
            console.error('Error deleting notification:', error);
            if (error.response?.status !== 404) {
                toast.error('Không thể xóa thông báo');
            }
        }
    },

    // Reset store
    reset: () => {
        set({
            notifications: [],
            unreadCount: 0,
            loading: false,
            error: null
        });
    }
}));

