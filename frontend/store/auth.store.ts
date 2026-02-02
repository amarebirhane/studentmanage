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
    isLoading: true, // Start in loading state to prevent premature redirects
    error: null,
    hasAttemptedLoad: false,

    login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
            console.log('Auth Store - Calling login API...');
            const response = await authService.login(credentials);
            set({
                user: response.user,
                token: response.token,
                isAuthenticated: true,
                isLoading: false,
                hasAttemptedLoad: true,
            });
        } catch (err: any) {
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
            console.error("Logout error", error);
        } finally {
            set({
                user: null,
                token: null,
                isAuthenticated: false,
                hasAttemptedLoad: true, // We've attempted to load (and we know it's empty)
                isLoading: false,
            });
        }
    },

    loadUser: async () => {
        // Prevent multiple simultaneous loads or redundant loads
        if (get().hasAttemptedLoad && get().user) {
            set({ isLoading: false });
            return;
        }

        set({ isLoading: true });
        try {
            const user = await authService.getProfile();
            set({ user, isAuthenticated: true, isLoading: false, hasAttemptedLoad: true });
        } catch (error) {
            set({ user: null, token: null, isAuthenticated: false, isLoading: false, hasAttemptedLoad: true });
        }
    }
}));
