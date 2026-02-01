"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
exports.config = {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '5000', 10),
    jwt: {
        secret: process.env.JWT_SECRET || 'your_jwt_secret',
        expire: process.env.JWT_EXPIRE || '30d',
        cookieExpire: parseInt(process.env.JWT_COOKIE_EXPIRE || '30', 10),
    },
    db: {
        url: process.env.DATABASE_URL,
    },
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    },
    upload: {
        path: path_1.default.join(__dirname, '../../uploads'),
    }
};
