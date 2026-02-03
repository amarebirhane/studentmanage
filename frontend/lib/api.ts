import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

const api: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
    withCredentials: true, // Important for HTTP-only cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Add X-School-ID if present in localStorage
        if (typeof window !== 'undefined') {
            const schoolId = localStorage.getItem('selectedSchoolId');
            if (schoolId) {
                config.headers['X-School-ID'] = schoolId;
            }

            // Manually inject token from cookie to ensure it reaches backend
            // This fixes issues where SameSite=Strict blocks cookies on cross-port localhost requests
            const token = document.cookie
                .split('; ')
                .find((row) => row.startsWith('token='))
                ?.split('=')[1];

            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            // Clear any local storage but DON'T hard redirect
            // Let the middleware/auth store handle the state transition
            if (typeof window !== 'undefined') {
                localStorage.removeItem('user');
            }
        }
        return Promise.reject(error);
    }
);

export default api;
