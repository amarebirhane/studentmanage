'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from '@/components/layout/sidebar';
import Navbar from '@/components/layout/navbar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();

    // Debug logging
    useEffect(() => {
        console.log('Dashboard Layout - Auth State:', {
            user,
            isLoading,
            isAuthenticated,
            hasUser: !!user
        });
    }, [user, isLoading, isAuthenticated]);

    useEffect(() => {
        // If not loading and not authenticated, redirect to login
        if (!isLoading && !isAuthenticated && !user) {
            console.log('Redirecting to login - no user');
            router.push('/login');
        }
    }, [isLoading, isAuthenticated, user, router]);

    if (isLoading) {
        console.log('Dashboard Layout - Showing loading spinner');
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user) {
        console.log('Dashboard Layout - No user, showing loading while redirecting');
        // Show loading while redirecting
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    console.log('Dashboard Layout - Rendering dashboard with user:', user.email);
    return (
        <div className="flex min-h-screen bg-background nebula-gradient">
            <Sidebar />
            <div className="flex-1 flex flex-col ml-72">
                <Navbar />
                <main className="p-8 flex-1 overflow-auto custom-scrollbar">
                    {children}
                </main>
            </div>
        </div>
    );
}
