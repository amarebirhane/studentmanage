import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

class SocketService {
    public socket: Socket | null = null;

    connect() {
        if (this.socket) return;

        this.socket = io(SOCKET_URL, {
            withCredentials: true,
            transports: ['websocket', 'polling']
        });

        this.socket.on('connect', () => {
            console.log('✅ Connected to Real-time API:', this.socket?.id);
        });

        this.socket.on('connect_error', (error) => {
            console.error('❌ Socket connection error:', error);
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    emit(event: string, data: any) {
        this.socket?.emit(event, data);
    }

    on(event: string, callback: (...args: any[]) => void) {
        this.socket?.on(event, callback);
    }

    off(event: string, callback: (...args: any[]) => void) {
        this.socket?.off(event, callback);
    }
}

const socketService = new SocketService();
export default socketService;
