import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './app';
import { config, connectDB } from './config';

const startServer = async () => {
    // Connect to Database
    await connectDB();

    const PORT = config.port;
    const httpServer = createServer(app);

    const io = new Server(httpServer, {
        cors: {
            origin: config.cors.origin,
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log('🔌 New client connected:', socket.id);

        socket.on('disconnect', () => {
            console.log('🔌 Client disconnected:', socket.id);
        });
    });

    // Make io accessible in the app
    app.set('io', io);

    const server = httpServer.listen(PORT, () => {
        console.log(`🚀 Server running in ${config.env} mode on port ${PORT}`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err: any) => {
        console.log(`Error: ${err.message}`);
        // Close server & exit process
        server.close(() => process.exit(1));
    });
};

startServer();
