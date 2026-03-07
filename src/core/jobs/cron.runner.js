const cron = require('node-cron');
const redis = require('../../core/redis'); // your existing redis client
const { releaseEligibleHolds } = require('../../modules/wallet/wallet.release.service');

const CRON_LOCK_KEY = 'cron:wallet_release_lock';
const LOCK_TTL_SECONDS = 240; // 4 minutes safety

async function acquireLock() {
  const result = await redis.set(
    CRON_LOCK_KEY,
    'locked',
    'NX',
    'EX',
    LOCK_TTL_SECONDS
  );

  return result === 'OK';
}

async function runEscrowReleaseJob() {
  const lockAcquired = await acquireLock();

  if (!lockAcquired) {
    console.log('[CRON] Another instance is running release job');
    return;
  }

  try {
    console.log('[CRON] Running wallet release engine...');

    const result = await releaseEligibleHolds();

    console.log(`[CRON] Released: ${result.released}`);
  } catch (err) {
    console.error('[CRON ERROR]', err.message);
  }
}

function startCronJobs() {
  console.log('🚀 Enterprise Cron Engine Started');

  // Every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    await runEscrowReleaseJob();
  });
}

module.exports = {
  startCronJobs
};
