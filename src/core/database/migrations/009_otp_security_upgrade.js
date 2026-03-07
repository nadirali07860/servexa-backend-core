const pool = require('../index');

module.exports.up = async () => {
  await pool.query(`
    ALTER TABLE otp_logs
    ADD COLUMN IF NOT EXISTS attempts INTEGER DEFAULT 0;
  `);

  await pool.query(`
    ALTER TABLE otp_logs
    ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP NULL;
  `);
};

module.exports.down = async () => {
  await pool.query(`
    ALTER TABLE otp_logs
    DROP COLUMN IF EXISTS attempts;
  `);

  await pool.query(`
    ALTER TABLE otp_logs
    DROP COLUMN IF EXISTS locked_until;
  `);
};
