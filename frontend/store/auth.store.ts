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
