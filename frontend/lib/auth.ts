// Auth helper functions or constants
export const AUTH_COOKIE_NAME = 'auth_token';

// Helper to get token (example)
export const getToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
};
