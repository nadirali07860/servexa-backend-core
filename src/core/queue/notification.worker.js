const { Worker } = require('bullmq');
const redisClient = require('../redis/redisClient');
const logger = require('../logger');

const worker = new Worker(
  'notifications',
  async job => {

    logger.info('Notification job started', {
      jobId: job.id,
      data: job.data
    });

    /*
      future:
      push notification
      sms
      email
    */

  },
  {
    connection: redisClient
  }
);

worker.on('completed', job => {

  logger.info('Notification job completed', {
    jobId: job.id
  });

});

worker.on('failed', (job, err) => {

  logger.error('Notification job failed', {
    jobId: job.id,
    error: err.message
  });

});
