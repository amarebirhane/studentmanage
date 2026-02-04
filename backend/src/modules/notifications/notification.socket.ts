import { Server, Socket } from 'socket.io';
import { verifyToken } from '../../utils/jwt';

export const setupNotificationSocket = (io: Server) => {
    // Middleware to authenticate socket connections
    io.use((socket, next) => {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];

        if (!token) {
            return next(new Error('Authentication error: No token provided'));
        }

        try {
            const decoded = verifyToken(token);
            // @ts-ignore
            socket.user = decoded;
            next();
        } catch (err) {
            next(new Error('Authentication error: Invalid token'));
        }
    });

    io.on('connection', (socket: Socket) => {
        // @ts-ignore
        const userId = socket.user.id;

        console.log(`🔌 User connected to socket: ${userId}`);

        // Join a private room for the user
        socket.join(`user:${userId}`);

        socket.on('disconnect', () => {
            console.log(`🔌 User disconnected: ${userId}`);
        });
    });
};

// Helper function to emit notification to a specific user
export const emitNotificationToUser = (io: Server, userId: string, event: string, data: any) => {
    io.to(`user:${userId}`).emit(event, data);
};
