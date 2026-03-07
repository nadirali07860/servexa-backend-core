exports.up = async (pool) => {
  await pool.query(`
    ALTER TABLE services
    ADD COLUMN IF NOT EXISTS guarantee_days INTEGER DEFAULT 0;
  `);

  await pool.query(`
    ALTER TABLE bookings
    ADD COLUMN IF NOT EXISTS guarantee_days_snapshot INTEGER,
    ADD COLUMN IF NOT EXISTS guarantee_expiry_at TIMESTAMP;
  `);
};

exports.down = async (pool) => {
  await pool.query(`
    ALTER TABLE bookings
    DROP COLUMN IF EXISTS guarantee_days_snapshot,
    DROP COLUMN IF EXISTS guarantee_expiry_at;
  `);

  await pool.query(`
    ALTER TABLE services
    DROP COLUMN IF EXISTS guarantee_days;
  `);
};
