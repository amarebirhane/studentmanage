import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';

export const useAuth = () => {
    const store = useAuthStore();

    // Optional: Load user on mount if not loaded
    useEffect(() => {
        if (!store.user && !store.isAuthenticated && store.isLoading) {
            store.loadUser();
        }
    }, []); // Run once

    return store;
};
