import Redis from 'ioredis';
import { config } from './env';
import { logger } from './logger';

// Default to localhost if not provided in env
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const redis = new Redis(redisUrl, {
    retryStrategy(times) {
        // Exponential backoff with a cap of 10 seconds
        const delay = Math.min(times * 100, 10000);
        return delay;
    },
    // Set to null to allow infinite retries and prevent crashing the process 
    // when Redis is unavailable during development
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
});

redis.on('connect', () => {
    logger.info('Successfully connected to Redis');
});

redis.on('error', (err) => {
    logger.error('Redis connection error', err);
});

export default redis;
