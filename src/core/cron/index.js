const slotRelease = require('../../modules/slotLock/slotRelease.service');

function startCron() {

  console.log("🚀 Enterprise Cron Engine Started");

  setInterval(async () => {

    try {

      await slotRelease.releaseExpiredLocks();

    } catch (err) {

      console.error("Slot release cron failed:", err);

    }

  }, 30000);

}

module.exports = startCron;
