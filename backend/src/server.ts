import app from './app';
import { config, connectDB } from './config';

const startServer = async () => {
    // Connect to Database
    await connectDB();

    const PORT = config.port;

    const server = app.listen(PORT, () => {
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
