'use client';

import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'react-hot-toast';
import { usePathname } from 'next/navigation';

export const SocketClient = () => {
    const { user } = useAuth();
    const pathname = usePathname();

    useEffect(() => {
        if (!user) return;

        // Initialize socket connection
        const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', {
            auth: {
                token: localStorage.getItem('token') // Assuming token is stored here
            },
            withCredentials: true
        });

        socket.on('connect', () => {
            console.log('🔌 Connected to notification server');
        });

        socket.on('notification', (data: any) => {
            // Play a sound (optional)
            // const audio = new Audio('/sounds/notification.mp3');
            // audio.play().catch(e => console.log('Audio play failed', e));

            toast(data.message, {
                icon: '🔔',
                duration: 5000,
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });
        });

        socket.on('disconnect', () => {
            console.log('🔌 Disconnected from notification server');
        });

        return () => {
            socket.disconnect();
        };
    }, [user, pathname]); // Re-connect logic if needed, but usually just on mount/user change

    return null; // This component doesn't render anything
};
