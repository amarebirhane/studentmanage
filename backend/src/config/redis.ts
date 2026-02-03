import Redis from 'ioredis';
import { config } from './env';
import { logger } from './logger';

// Default to localhost if not provided in env
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const redis = new Redis(redisUrl, {
    retryStrategy(times) {
        // Limit retries to 3 attempts during development
        if (times > 3) {
            logger.warn('⚠️  Redis connection failed after 3 attempts. Running without Redis cache.');
            return null; // Stop retrying
        }
        // Exponential backoff
        const delay = Math.min(times * 100, 3000);
        return delay;
    },
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    // Don't immediately connect, let it connect on first command
    lazyConnect: false,
});

redis.on('connect', () => {
    logger.info('✅ Successfully connected to Redis');
});

redis.on('error', (err: any) => {
    if (err.code === 'ECONNREFUSED') {
        // Silently ignore connection refused errors after initial attempts
        return;
    }
    logger.error('Redis connection error', err);
});

redis.on('close', () => {
    // Silently handle connection close
});

export default redis;
