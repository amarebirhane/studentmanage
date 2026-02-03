import { Queue, Worker, Job } from 'bullmq';
import redisClient from './redis';
import { logger } from './logger';

let emailQueue: Queue | null = null;
let emailWorker: Worker | null = null;

// Temporarily disable BullMQ to prevent Redis connection errors
// Uncomment when Redis is properly configured and running
/*
try {
    emailQueue = new Queue('emailQueue', {
        connection: redisClient,
    });

    // Example Worker
    emailWorker = new Worker(
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

    logger.info('✅ BullMQ queue initialized with Redis');
} catch (error) {
    logger.warn('⚠️  BullMQ not available. Background jobs will be disabled.');
}
*/

logger.warn('⚠️  BullMQ disabled. Background jobs unavailable until Redis is configured.');

export { emailQueue, emailWorker };
