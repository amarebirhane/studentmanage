import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';

export const useAuth = () => {
    const { user, isAuthenticated, isLoading, error, hasAttemptedLoad, login, register, logout, loadUser, updateProfile } = useAuthStore();

    // Load user only once on initial mount if token exists but user is not loaded
    useEffect(() => {
        const hasToken = document.cookie.split(';').some(c => c.trim().startsWith('token='));

        // Trigger loadUser if we haven't attempted it yet and have a token
        if (!hasAttemptedLoad && !user && hasToken) {
            loadUser().catch(() => {
                // Silently fail - user is not authenticated
            });
        } else if (!hasAttemptedLoad && !user && !hasToken) {
            // If no token, just mark as loaded
            useAuthStore.setState({ hasAttemptedLoad: true, isLoading: false });
        }
    }, [hasAttemptedLoad, user, loadUser]);

    return {
        user,
        isAuthenticated,
        isLoading,
        error,
        hasAttemptedLoad,
        login,
        register,
        logout,
        loadUser,
        updateProfile,
        isAdmin: user?.role === 'ADMIN',
        isTeacher: user?.role === 'TEACHER',
        isStudent: user?.role === 'STUDENT',
        isParent: user?.role === 'PARENT',
    };
};
