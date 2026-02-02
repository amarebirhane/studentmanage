"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const logger_1 = require("./logger");
// Default to localhost if not provided in env
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const redis = new ioredis_1.default(redisUrl, {
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
    logger_1.logger.info('Successfully connected to Redis');
});
redis.on('error', (err) => {
    logger_1.logger.error('Redis connection error', err);
});
exports.default = redis;
