"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authLimiter = exports.limiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const rate_limit_redis_1 = require("rate-limit-redis");
const redis_1 = __importDefault(require("../config/redis"));
exports.limiter = (0, express_rate_limit_1.default)({
    windowMs: 30 * 60 * 1000, // 30 minutes
    max: 500,
    standardHeaders: true,
    legacyHeaders: false,
    store: new rate_limit_redis_1.RedisStore({
        // @ts-expect-error - ioredis types mismatch with rate-limit-redis but it works
        sendCommand: (...args) => redis_1.default.call(...args),
    }),
    message: 'Too many requests from this IP, please try again after 30 minutes',
});
exports.authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 30 * 60 * 1000, // 30 minutes
    max: 50,
    skipSuccessfulRequests: true,
    store: new rate_limit_redis_1.RedisStore({
        // @ts-expect-error
        sendCommand: (...args) => redis_1.default.call(...args),
    }),
    message: 'Too many authentication attempts from this IP, please try again after 30 minutes',
});
