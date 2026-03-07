const { Queue } = require('bullmq');
const redisClient = require('../redis/redisClient');

function createQueue(name) {
  return new Queue(name, {
    connection: redisClient
  });
}

module.exports = createQueue;
