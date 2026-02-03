import rateLimit from 'express-rate-limit';

let redisClient: any;
let useRedis = false;

// Try to use Redis if available, fall back to memory store
try {
    const { RedisStore } = require('rate-limit-redis');
    redisClient = require('../config/redis').default;

    // Only use Redis if it's actually connected
    if (redisClient.status === 'ready' || redisClient.status === 'connecting') {
        useRedis = true;
        console.log('✅ Using Redis for rate limiting');
    } else {
        console.log('⚠️  Redis not connected, using memory store for rate limiting');
    }
} catch (error) {
    console.log('⚠️  Redis unavailable, using memory store for rate limiting');
}

// Factory function to create a unique RedisStore for each limiter
const createStore = (prefix: string) => {
    // Don't use Redis if it wasn't successfully initialized
    if (!useRedis || !redisClient) {
        return undefined; // Will use default memory store
    }

    try {
        const { RedisStore } = require('rate-limit-redis');
        return new RedisStore({
            sendCommand: async (...args: string[]) => {
                try {
                    // Fail safely if connection is closed
                    if (redisClient.status !== 'ready' && redisClient.status !== 'connecting') {
                        throw new Error('Redis connection lost');
                    }
                    return await redisClient.call(...args);
                } catch (error) {
                    // Log error but don't crash
                    // console.error(`Rate limit Redis error: ${error.message}`);
                    throw error;
                }
            },
            prefix: `rl:${prefix}:`, // Unique prefix for each limiter
        });
    } catch (error) {
        console.log(`⚠️  Failed to create RedisStore for ${prefix}, using memory store`);
        return undefined;
    }
};

// Skip function to fail open if Redis is down
const skipIfRedisDown = () => {
    if (useRedis && redisClient && redisClient.status !== 'ready' && redisClient.status !== 'connecting') {
        // console.warn('⚠️  Redis down, skipping rate limit');
        return true;
    }
    return false;
};

export const limiter = rateLimit({
    windowMs: 30 * 60 * 1000, // 30 minutes
    max: 500,
    standardHeaders: true,
    legacyHeaders: false,
    store: createStore('general'),
    skip: skipIfRedisDown,
    message: 'Too many requests from this IP, please try again after 30 minutes',
});

export const authLimiter = rateLimit({
    windowMs: 30 * 60 * 1000, // 30 minutes
    max: 50,
    skipSuccessfulRequests: true,
    store: createStore('auth'),
    skip: skipIfRedisDown,
    message:
        'Too many authentication attempts from this IP, please try again after 30 minutes',
});
