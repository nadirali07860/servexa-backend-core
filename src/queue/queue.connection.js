const { Queue } = require('bullmq');
const redisClient = require('../core/redis/redisClient');

function createQueue(name) {

  return new Queue(name, {
    connection: redisClient
  });

}

module.exports = createQueue;
