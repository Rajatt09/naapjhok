import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    withCredentials: true, // Important for cookies
});

// Variable to hold the access token
let accessToken = null;

export const setAccessToken = (token) => {
    accessToken = token;
};

// Request Interceptor: Attach Token
api.interceptors.request.use(
    (config) => {
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle Refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // Skip refresh logic for Login/Signup requests (let 401 pass through)
        if (originalRequest.url.includes('/auth/login') || originalRequest.url.includes('/auth/signup')) {
            return Promise.reject(error);
        }

        // If 401 and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Call refresh endpoint
                const res = await axios.post('/api/auth/refresh-token', {}, { withCredentials: true });
                
                // If successful, update access token
                const newAccessToken = res.data.accessToken;
                setAccessToken(newAccessToken);
                
                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);

            } catch (refreshError) {
                // Refresh failed (token expired/invalid) -> user is effectively logged out
                // We'll handle redirection in the Context or UI
                setAccessToken(null);
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
