import rateLimit from 'express-rate-limit';

let rateLimitStore: any;

// Try to use Redis if available, fall back to memory store
try {
    const { RedisStore } = require('rate-limit-redis');
    const redisClient = require('../config/redis').default;

    rateLimitStore = new RedisStore({
        sendCommand: (...args: string[]) => redisClient.call(...args),
    });
    console.log('✅ Using Redis for rate limiting');
} catch (error) {
    console.log('⚠️  Redis unavailable, using memory store for rate limiting');
    rateLimitStore = undefined; // Will use default memory store
}

export const limiter = rateLimit({
    windowMs: 30 * 60 * 1000, // 30 minutes
    max: 500,
    standardHeaders: true,
    legacyHeaders: false,
    store: rateLimitStore,
    message: 'Too many requests from this IP, please try again after 30 minutes',
});

export const authLimiter = rateLimit({
    windowMs: 30 * 60 * 1000, // 30 minutes
    max: 50,
    skipSuccessfulRequests: true,
    store: rateLimitStore,
    message:
        'Too many authentication attempts from this IP, please try again after 30 minutes',
});
