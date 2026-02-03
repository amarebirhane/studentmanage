import rateLimit from 'express-rate-limit';

let redisClient: any;
let useRedis = false;

// Try to use Redis if available, fall back to memory store
try {
    const { RedisStore } = require('rate-limit-redis');
    redisClient = require('../config/redis').default;
    useRedis = true;
} catch (error) {
    console.log('⚠️  Redis unavailable, using memory store for rate limiting');
}

// Factory function to create a unique RedisStore for each limiter
const createStore = (prefix: string) => {
    if (!useRedis) return undefined;

    try {
        const { RedisStore } = require('rate-limit-redis');
        return new RedisStore({
            sendCommand: (...args: string[]) => redisClient.call(...args),
            prefix: `rl:${prefix}:`, // Unique prefix for each limiter
        });
    } catch (error) {
        return undefined;
    }
};

export const limiter = rateLimit({
    windowMs: 30 * 60 * 1000, // 30 minutes
    max: 500,
    standardHeaders: true,
    legacyHeaders: false,
    store: createStore('general'),
    message: 'Too many requests from this IP, please try again after 30 minutes',
});

export const authLimiter = rateLimit({
    windowMs: 30 * 60 * 1000, // 30 minutes
    max: 50,
    skipSuccessfulRequests: true,
    store: createStore('auth'),
    message:
        'Too many authentication attempts from this IP, please try again after 30 minutes',
});
