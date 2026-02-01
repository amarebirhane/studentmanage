"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log('✅ PostgreSQL Connected via Prisma');
    }
    catch (error) {
        console.error('❌ PostgreSQL Connection Error:', error.message);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
exports.default = prisma;
