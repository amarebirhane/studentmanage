import { Queue, Worker, Job } from 'bullmq';
import redisClient from './redis';
import { logger } from './logger';

let emailQueue: Queue | null = null;
let emailWorker: Worker | null = null;

// Only initialize BullMQ if Redis is available
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

export { emailQueue, emailWorker };
