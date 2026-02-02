import { Queue, Worker, Job } from 'bullmq';
import redisClient from './redis';
import { logger } from './logger';

export const emailQueue = new Queue('emailQueue', {
    connection: redisClient,
});

// Example Worker
export const emailWorker = new Worker(
    'emailQueue',
    async (job: Job) => {
        logger.info(`Processing job ${job.id} for email ${job.data.email}`);
        // Add actual email sending logic here
    },
    { connection: redisClient }
);

emailWorker.on('completed', (job) => {
    logger.info(`Job ${job.id} completed successfully`);
});

emailWorker.on('failed', (job, err) => {
    logger.error(`Job ${job?.id} failed with error: ${err.message}`);
});
