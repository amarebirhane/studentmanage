import { create } from 'zustand';
import { User, LoginCredentials } from '@/types/user'; // Ensure LoginCredentials is exported from types/user
import { authService } from '@/services/auth.service';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    hasAttemptedLoad: boolean; // Track if we've tried to load user

    login: (credentials: LoginCredentials) => Promise<void>;
    register: (userData: any) => Promise<void>;
    logout: () => void;
    loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false, // Changed to false initially to prevent auto-load
    error: null,
    hasAttemptedLoad: false,

    login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
            console.log('Auth Store - Calling login API...');
            const response = await authService.login(credentials);
            console.log('Auth Store - Login API response:', response);
            console.log('Auth Store - Setting state with user:', response.user);

            set({
                user: response.user,
                token: response.token,
                isAuthenticated: true,
                isLoading: false,
                hasAttemptedLoad: true,
            });

            console.log('Auth Store - State updated, current user:', get().user);
        } catch (err: any) {
            console.error('Auth Store - Login error:', err);
            set({
                error: err.response?.data?.message || 'Login failed',
                isLoading: false,
            });
            throw err; // Re-throw to allow component to handle specific UI feedback (like toasts)
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
            console.error("Logout error", error);
        } finally {
            set({
                user: null,
                token: null,
                isAuthenticated: false,
                hasAttemptedLoad: false,
            });
        }
    },

    loadUser: async () => {
        // Prevent multiple simultaneous loads
        if (get().isLoading || get().hasAttemptedLoad) {
            return;
        }

        set({ isLoading: true, hasAttemptedLoad: true });
        try {
            const user = await authService.getProfile();
            set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
            set({ user: null, token: null, isAuthenticated: false, isLoading: false });
        }
    }
}));
