import { create } from 'zustand';
import { User, LoginCredentials } from '@/types/user';
import { authService } from '@/services/auth.service';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    hasAttemptedLoad: boolean;

    selectedSchoolId: string | null;
    setSelectedSchoolId: (id: string | null) => void;
    login: (credentials: LoginCredentials) => Promise<any>;
    register: (userData: any) => Promise<void>;
    logout: () => void;
    loadUser: () => Promise<void>;
    updateProfile: (data: Partial<User>) => Promise<void>;
}

// Helper to set cookie manually (since we don't have js-cookie)
const setCookie = (name: string, value: string, days = 7) => {
    if (typeof window === 'undefined') return;
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `; expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value || ''}${expires}; path=/; SameSite=Lax`; // Removed Secure for localhost dev
};

const removeCookie = (name: string) => {
    if (typeof window === 'undefined') return;
    document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
};

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    hasAttemptedLoad: false,
    selectedSchoolId: typeof window !== 'undefined' ? localStorage.getItem('selectedSchoolId') : null,
    setSelectedSchoolId: (id) => {
        if (typeof window !== 'undefined') {
            if (id) localStorage.setItem('selectedSchoolId', id);
            else localStorage.removeItem('selectedSchoolId');
        }
        set({ selectedSchoolId: id });
    },

    login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
            console.log('Auth Store - Calling login API...');
            const response = await authService.login(credentials);
            console.log('Auth Store - Login Response:', response);

            // Handle 2FA requirement
            if ('twoFactorRequired' in response && response.twoFactorRequired) {
                set({ isLoading: false });
                return response; // Return response so UI can handle 2FA step
            }

            // Robust data extraction: Support both {user, token} and flat {id, email, token, ...}
            const user = ('user' in response) ? response.user : (('id' in response) ? response : null);
            const token = response.token;

            if (!user || !token) {
                console.error('Auth Store - ERROR: Incomplete response data!', { user, token, response });
                throw new Error('Identity verification failed: Incomplete profile or token data');
            }

            // Set token in cookie for middleware
            setCookie('token', token);

            // Set user role in cookie for easier middleware redirection if needed
            setCookie('user_role', user.role);

            set({
                user,
                token,
                isAuthenticated: true,
                isLoading: false,
                hasAttemptedLoad: true,
            });

            return response;
        } catch (err: any) {
            console.error('Auth Store - Login Error:', err);
            set({
                error: err.response?.data?.message || 'Login failed',
                isLoading: false,
                hasAttemptedLoad: true,
            });
            throw err;
        }
    },

    register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
            await authService.register(userData);
            set({ isLoading: false });
        } catch (err: any) {
            set({
                error: err.response?.data?.message || 'Registration failed',
                isLoading: false,
            });
            throw err;
        }
    },

    logout: async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error("Logout API error", error);
        } finally {
            removeCookie('token');
            removeCookie('user_role');
            localStorage.removeItem('selectedSchoolId');

            set({
                user: null,
                token: null,
                isAuthenticated: false,
                hasAttemptedLoad: true,
                isLoading: false,
            });

            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
    },

    loadUser: async () => {
        if (get().hasAttemptedLoad && get().user) {
            set({ isLoading: false });
            return;
        }

        set({ isLoading: true });
        try {
            const user = await authService.getProfile();
            // Ensure cookies stay synced on reload
            setCookie('user_role', user.role);

            set({ user, isAuthenticated: true, isLoading: false, hasAttemptedLoad: true });
        } catch (error) {
            removeCookie('token');
            removeCookie('user_role');
            set({ user: null, token: null, isAuthenticated: false, isLoading: false, hasAttemptedLoad: true });
        }
    },

    updateProfile: async (data) => {
        try {
            const updatedUser = await authService.updateProfile(data);
            set({ user: updatedUser });
        } catch (error) {
            console.error('Update profile error:', error);
            throw error;
        }
    }
}));
