import { useState, useEffect, useCallback } from 'react';
import { User, LoginCredentials } from '@/types/user';
import { authService } from '@/services/auth.service';

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadUser = useCallback(async () => {
        try {
            setLoading(true);
            const userData = await authService.getProfile();
            setUser(userData);
            setError(null);
        } catch (err: any) {
            setUser(null);
            setError(err.response?.data?.message || 'Failed to load user');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUser();
    }, [loadUser]);

    const login = async (credentials: LoginCredentials) => {
        try {
            setLoading(true);
            const response = await authService.login(credentials);
            setUser(response.user);
            setError(null);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Login failed';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
            setUser(null);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Logout failed');
        }
    };

    const refresh = async () => {
        await loadUser();
    };

    return {
        user,
        loading,
        error,
        login,
        logout,
        refresh,
        isAuthenticated: !!user,
    };
};
