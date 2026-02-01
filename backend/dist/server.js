"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config");
const startServer = async () => {
    // Connect to Database
    await (0, config_1.connectDB)();
    const PORT = config_1.config.port;
    const server = app_1.default.listen(PORT, () => {
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
