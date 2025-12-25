import axios from 'axios';

// Simple in-memory cache
const cache = new Map();
const CACHE_DURATION = 30 * 1000; // 30 seconds

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api',
    timeout: 30000, // 30 second timeout
});

// Cache helper
const getCacheKey = (config) => `${config.method}:${config.url}`;

// Get token from storage
const getToken = () => {
    return localStorage.getItem('token');
};

// Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // Add auth token from separate storage
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Check cache for GET requests
        if (config.method === 'get' && config.useCache !== false) {
            const cacheKey = getCacheKey(config);
            const cached = cache.get(cacheKey);
            if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
                config.adapter = () => Promise.resolve({
                    data: cached.data,
                    status: 200,
                    statusText: 'OK',
                    headers: {},
                    config,
                    cached: true
                });
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        // Cache GET responses
        if (response.config.method === 'get' && !response.cached) {
            const cacheKey = getCacheKey(response.config);
            cache.set(cacheKey, {
                data: response.data,
                timestamp: Date.now()
            });
        }
        return response;
    },
    (error) => {
        // Handle specific error codes
        if (error.response) {
            const status = error.response.status;
            
            if (status === 401) {
                // Token expired or invalid
                localStorage.removeItem('admin');
                localStorage.removeItem('teacher');
                localStorage.removeItem('token');
                
                // Only redirect if not already on login page
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }
            } else if (status === 403) {
                // Forbidden - show message but don't redirect
                console.warn('Access forbidden');
            } else if (status === 429) {
                // Rate limited
                console.warn('Rate limited - too many requests');
            }
        } else if (error.code === 'ECONNABORTED') {
            // Timeout
            console.error('Request timeout');
        }
        
        return Promise.reject(error);
    }
);

// Clear cache utility (call after mutations)
export const clearCache = (pattern) => {
    if (pattern) {
        for (const key of cache.keys()) {
            if (key.includes(pattern)) {
                cache.delete(key);
            }
        }
    } else {
        cache.clear();
    }
};

// Invalidate specific resources after mutations
export const invalidateStudents = () => clearCache('/students');
export const invalidateResults = () => clearCache('/results');

// Auth helpers
export const isAuthenticated = () => {
    const token = getToken();
    return !!token;
};

export const getUser = () => {
    const admin = localStorage.getItem('admin');
    const teacher = localStorage.getItem('teacher');
    
    if (admin) return { ...JSON.parse(admin), role: 'admin' };
    if (teacher) return { ...JSON.parse(teacher), role: 'teacher' };
    return null;
};

export const logout = () => {
    localStorage.removeItem('admin');
    localStorage.removeItem('teacher');
    localStorage.removeItem('token');
    clearCache();
    window.location.href = '/login';
};

export default axiosInstance;
