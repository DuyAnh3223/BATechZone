import axios from 'axios';

const baseURL = import.meta.env.MODE === 'development' ? "http://localhost:5001/api" : "/api";

// ==================== ADMIN API INSTANCE ====================
// For admin-related requests with separate JWT handling
export const adminApi = axios.create({
    baseURL,
    withCredentials: true, // Send cookies (admin_refresh_token)
});

// Admin request interceptor - Add admin access token
adminApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('admin_access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Mark auth check requests for silent error handling
        if (config.url?.includes('/auth/admin/me') || config.url?.includes('/auth/me')) {
            config._silentError = true;
            // Allow 401 to be treated as successful response (not error)
            // This prevents axios from logging errors to console
            config.validateStatus = (status) => status < 500;
        }
        
        return config;
    },
    (error) => Promise.reject(error)
);

// Admin response interceptor - Handle token refresh
let isAdminRefreshing = false;
let adminRefreshSubscribers = [];

const subscribeAdminTokenRefresh = (cb) => {
    adminRefreshSubscribers.push(cb);
};

const onAdminRefreshed = (token) => {
    adminRefreshSubscribers.forEach((cb) => cb(token));
    adminRefreshSubscribers = [];
};

adminApi.interceptors.response.use(
    (response) => {
        // Handle silent errors for auth check endpoints (validateStatus makes 401 a success)
        if (response.config._silentError && response.status === 401) {
            const silentError = new Error('Silent auth check failed');
            silentError.response = response;
            silentError.config = response.config;
            silentError._silent = true;
            return Promise.reject(silentError);
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        
        // Silent errors for auth check endpoints - don't log to console
        const isSilentError = originalRequest?._silentError === true;
        
        if (isSilentError && error.response?.status === 401) {
            // Suppress error without logging
            const silentError = new Error('Silent auth check failed');
            silentError.response = error.response;
            silentError.config = error.config;
            silentError._silent = true;
            return Promise.reject(silentError);
        }
        
        // Handle token expiration
        if (error.response?.status === 401 && 
            error.response?.data?.code === 'TOKEN_EXPIRED' && 
            !originalRequest._retry) {
            
            if (isAdminRefreshing) {
                // Wait for the refresh to complete
                return new Promise((resolve) => {
                    subscribeAdminTokenRefresh((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(adminApi(originalRequest));
                    });
                });
            }
            
            originalRequest._retry = true;
            isAdminRefreshing = true;
            
            try {
                // Refresh admin token
                const response = await axios.post(`${baseURL}/auth/refresh-admin`, {}, {
                    withCredentials: true
                });
                
                const { accessToken } = response.data;
                localStorage.setItem('admin_access_token', accessToken);
                
                isAdminRefreshing = false;
                onAdminRefreshed(accessToken);
                
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return adminApi(originalRequest);
            } catch (refreshError) {
                isAdminRefreshing = false;
                adminRefreshSubscribers = [];
                
                // Refresh failed - clear tokens and redirect to login
                localStorage.removeItem('admin_access_token');
                window.location.href = '/admin/login';
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);

// ==================== USER API INSTANCE ====================
// For user-related requests with separate JWT handling
export const userApi = axios.create({
    baseURL,
    withCredentials: true, // Send cookies (user_refresh_token)
});

// User request interceptor - Add user access token
userApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('user_access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Mark auth check requests for silent error handling
        if (config.url?.includes('/auth/user/me') || config.url?.includes('/auth/me')) {
            config._silentError = true;
            // Allow 401 to be treated as successful response (not error)
            config.validateStatus = (status) => status < 500;
        }
        
        // Mark notification requests for silent error handling (not implemented yet)
        if (config.url?.includes('/notifications')) {
            config._silentError = true;
            config.validateStatus = (status) => status < 500;
        }
        
        return config;
    },
    (error) => Promise.reject(error)
);

// User response interceptor - Handle token refresh
let isUserRefreshing = false;
let userRefreshSubscribers = [];

const subscribeUserTokenRefresh = (cb) => {
    userRefreshSubscribers.push(cb);
};

const onUserRefreshed = (token) => {
    userRefreshSubscribers.forEach((cb) => cb(token));
    userRefreshSubscribers = [];
};

userApi.interceptors.response.use(
    (response) => {
        // Handle silent errors for auth check endpoints (validateStatus makes 401/404 a success)
        if (response.config._silentError && (response.status === 401 || response.status === 404)) {
            const silentError = new Error('Silent check failed');
            silentError.response = response;
            silentError.config = response.config;
            silentError._silent = true;
            return Promise.reject(silentError);
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        
        // Handle token expiration FIRST (even for silent requests)
        // Try to refresh token before giving up
        if (error.response?.status === 401 && !originalRequest._retry) {
            
            if (isUserRefreshing) {
                // Wait for the refresh to complete
                return new Promise((resolve) => {
                    subscribeUserTokenRefresh((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(userApi(originalRequest));
                    });
                });
            }
            
            originalRequest._retry = true;
            isUserRefreshing = true;
            
            try {
                // Refresh user token
                const response = await axios.post(`${baseURL}/auth/refresh-user`, {}, {
                    withCredentials: true
                });
                
                const { accessToken } = response.data;
                localStorage.setItem('user_access_token', accessToken);
                
                isUserRefreshing = false;
                onUserRefreshed(accessToken);
                
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return userApi(originalRequest);
            } catch (refreshError) {
                isUserRefreshing = false;
                userRefreshSubscribers = [];
                
                // Refresh failed - clear tokens
                localStorage.removeItem('user_access_token');
                
                // If it's a silent request (auth check), don't redirect, just reject silently
                const isSilentError = originalRequest?._silentError === true;
                if (isSilentError) {
                    const silentError = new Error('Silent check failed');
                    silentError._silent = true;
                    return Promise.reject(silentError);
                }
                
                // Otherwise redirect to login
                window.location.href = '/auth/signin';
                return Promise.reject(refreshError);
            }
        }
        
        // Handle other silent errors (404, etc) without redirect
        const isSilentError = originalRequest?._silentError === true;
        if (isSilentError && (error.response?.status === 401 || error.response?.status === 404)) {
            const silentError = new Error('Silent check failed');
            silentError.response = error.response;
            silentError.config = error.config;
            silentError._silent = true;
            return Promise.reject(silentError);
        }
        
        return Promise.reject(error);
    }
);

// ==================== DEFAULT API (Backward Compatibility) ====================
// For general requests without specific JWT handling
const api = axios.create({
    baseURL,
    withCredentials: true,
});

// Basic interceptor for backward compatibility
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Silent errors for auth check endpoints
        const isAuthCheck = error.config?.url?.includes('/auth/user/me') || 
                           error.config?.url?.includes('/auth/admin/me') ||
                           error.config?.url?.includes('/auth/me');
        
        if (error.response?.status === 401 && isAuthCheck) {
            return Promise.reject(error);
        }
        
        // Silent errors for notifications
        const isNotificationCheck = error.config?.url?.includes('/notifications');
        if (error.response?.status === 404 && isNotificationCheck) {
            return Promise.reject(error);
        }
        
        return Promise.reject(error);
    }
);

export default api;
export { axios };
