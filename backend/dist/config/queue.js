"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailWorker = exports.emailQueue = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = __importDefault(require("./redis"));
const logger_1 = require("./logger");
exports.emailQueue = new bullmq_1.Queue('emailQueue', {
    connection: redis_1.default,
});
// Example Worker
exports.emailWorker = new bullmq_1.Worker('emailQueue', async (job) => {
    logger_1.logger.info(`Processing job ${job.id} for email ${job.data.email}`);
    // Add actual email sending logic here
}, { connection: redis_1.default });
exports.emailWorker.on('completed', (job) => {
    logger_1.logger.info(`Job ${job.id} completed successfully`);
});
exports.emailWorker.on('failed', (job, err) => {
    logger_1.logger.error(`Job ${job?.id} failed with error: ${err.message}`);
});
