const notificationQueue = require('../../core/queue/notification.queue');

async function sendNotification(data){

  await notificationQueue.add(

    'sendNotification',

    data,

    {

      attempts: 3,

      backoff: 5000

    }

  );

}

module.exports = {

  sendNotification

};
