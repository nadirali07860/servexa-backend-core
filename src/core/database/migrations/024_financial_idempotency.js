const pool = require('../index');

module.exports.up = async () => {
  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_wallet_booking_unique
    ON wallet_transactions (booking_id, user_id);
  `);

  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_platform_booking_unique
    ON platform_earnings (booking_id);
  `);
};

module.exports.down = async () => {
  console.log('Financial idempotency rollback skipped');
};
