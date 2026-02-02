import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';

export const useAuth = () => {
    const store = useAuthStore();

    // Load user only once on initial mount if token exists but user is not loaded
    useEffect(() => {
        // Only attempt to load user if:
        // 1. No user is currently loaded
        // 2. Not already authenticated
        // 3. Initial loading state is true (meaning we haven't tried yet)
        // 4. We're not currently in the middle of loading
        const shouldLoadUser = !store.user && !store.isAuthenticated && store.isLoading;

        if (shouldLoadUser) {
            store.loadUser().catch(() => {
                // Silently fail - user is not authenticated
                // This prevents console errors on public pages
            });
        }
    }, []); // Empty dependency array - run only once on mount

    return {
        ...store,
        isAdmin: store.user?.role === 'ADMIN',
        isTeacher: store.user?.role === 'TEACHER',
        isStudent: store.user?.role === 'STUDENT',
        isParent: store.user?.role === 'PARENT',
    };
};
