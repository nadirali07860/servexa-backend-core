const createQueue = require('./queue.connection');

const notificationQueue = createQueue('notifications');

async function addNotificationJob(data) {

  await notificationQueue.add('send_notification', data);

}

module.exports = {
  notificationQueue,
  addNotificationJob
};
