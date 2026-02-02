"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config");
const startServer = async () => {
    // Connect to Database
    await (0, config_1.connectDB)();
    const PORT = config_1.config.port;
    const httpServer = (0, http_1.createServer)(app_1.default);
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: config_1.config.cors.origin,
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
    app_1.default.set('io', io);
    const server = httpServer.listen(PORT, () => {
        console.log(`🚀 Server running in ${config_1.config.env} mode on port ${PORT}`);
    });
    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
        console.log(`Error: ${err.message}`);
        // Close server & exit process
        server.close(() => process.exit(1));
    });
};
startServer();
