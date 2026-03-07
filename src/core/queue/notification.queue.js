const createQueue = require('./queue');

const notificationQueue = createQueue('notifications');

async function sendNotificationJob(data) {

  await notificationQueue.add(
    'send_notification',
    data,
    {
      attempts: 3,
      removeOnComplete: true
    }
  );

}

module.exports = {
  notificationQueue,
  sendNotificationJob
};
