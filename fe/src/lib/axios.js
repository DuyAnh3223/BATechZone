import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.MODE === 'development' ? "http://localhost:5001/api" : "/api",
    withCredentials: true, // Gửi cookie cùng với yêu cầu
});

// Interceptor để xử lý lỗi im lặng cho các endpoint đặc biệt
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Nếu là lỗi 401 từ endpoint check auth, không log error
        const isAuthCheck = error.config?.url?.includes('/auth/user/me') || 
                           error.config?.url?.includes('/auth/admin/me') ||
                           error.config?.url?.includes('/auth/me');
        
        if (error.response?.status === 401 && isAuthCheck) {
            // Trả về rejected promise mà không log error
            return Promise.reject(error);
        }
        
        // Nếu là lỗi 404 từ endpoint notifications (chưa implement), không log error
        const isNotificationCheck = error.config?.url?.includes('/notifications');
        if (error.response?.status === 404 && isNotificationCheck) {
            // Trả về rejected promise mà không log error
            return Promise.reject(error);
        }
        
        // Các lỗi khác vẫn được xử lý bình thường
        return Promise.reject(error);
    }
);

export default api;
export { axios };
