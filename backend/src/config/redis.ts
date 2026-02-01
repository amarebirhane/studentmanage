import Redis from 'ioredis';
import { config } from './env';
import { logger } from './logger';

// Default to localhost if not provided in env
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const redis = new Redis(redisUrl, {
    retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
    maxRetriesPerRequest: 3,
});

redis.on('connect', () => {
    logger.info('Successfully connected to Redis');
});

redis.on('error', (err) => {
    logger.error('Redis connection error', err);
});

export default redis;
