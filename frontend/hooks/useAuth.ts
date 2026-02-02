import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';

export const useAuth = () => {
    const { user, isAuthenticated, isLoading, error, hasAttemptedLoad, login, register, logout, loadUser, updateProfile } = useAuthStore();

    // Load user only once on initial mount if token exists but user is not loaded
    useEffect(() => {
        // Trigger loadUser if we haven't attempted it yet
        if (!hasAttemptedLoad && !user) {
            loadUser().catch(() => {
                // Silently fail - user is not authenticated
            });
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
