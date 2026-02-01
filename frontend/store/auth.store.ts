import { create } from 'zustand';
import { User, LoginCredentials } from '@/types/user'; // Ensure LoginCredentials is exported from types/user
import { authService } from '@/services/auth.service';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean; // Added loading state
    error: string | null;

    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
    loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    token: null, // You might want to initialize this from localStorage if dealing with persistence directly here, or relying on cookies. 
    isAuthenticated: false,
    isLoading: true,
    error: null,

    login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
            const response = await authService.login(credentials);
            set({
                user: response.user,
                token: response.token,
                isAuthenticated: true,
                isLoading: false
            });
        } catch (err: any) {
            set({
                error: err.response?.data?.message || 'Login failed',
                isLoading: false
            });
            throw err; // Re-throw to allow component to handle specific UI feedback (like toasts)
        }
    },

    logout: async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error("Logout error", error);
        } finally {
            set({ user: null, token: null, isAuthenticated: false });
        }
    },

    loadUser: async () => {
        // Avoid infinite loading if already loaded? Or rely on useEffect in a wrapper.
        set({ isLoading: true });
        try {
            const user = await authService.getProfile();
            set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
            set({ user: null, token: null, isAuthenticated: false, isLoading: false });
        }
    }
}));
