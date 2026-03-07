const { Worker } = require('bullmq');
const redisClient = require('../core/redis/redisClient');
const logger = require('../core/logger');

const worker = new Worker(
  'notifications',
  async job => {

    logger.info('Processing notification job', {
      jobId: job.id,
      data: job.data
    });

    // future: send push / sms / email

  },
  {
    connection: redisClient
  }
);

worker.on('completed', job => {
  logger.info('Notification job completed', { jobId: job.id });
});

worker.on('failed', (job, err) => {
  logger.error('Notification job failed', {
    jobId: job.id,
    error: err.message
  });
});
