import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import redisClient from '../config/redis';

export const limiter = rateLimit({
    windowMs: 30 * 60 * 1000, // 30 minutes
    max: 500,
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
        // @ts-expect-error - ioredis types mismatch with rate-limit-redis but it works
        sendCommand: (...args: string[]) => redisClient.call(...args),
    }),
    message: 'Too many requests from this IP, please try again after 30 minutes',
});

export const authLimiter = rateLimit({
    windowMs: 30 * 60 * 1000, // 30 minutes
    max: 50,
    skipSuccessfulRequests: true,
    store: new RedisStore({
        // @ts-expect-error
        sendCommand: (...args: string[]) => redisClient.call(...args),
    }),
    message:
        'Too many authentication attempts from this IP, please try again after 30 minutes',
});
