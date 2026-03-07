const pool = require('../index');

module.exports.up = async () => {

  /* ===================== USERS SOCIETY ===================== */

  await pool.query(`
    ALTER TABLE users
    ADD COLUMN IF NOT EXISTS society_id UUID;
  `);

  await pool.query(`
    ALTER TABLE users
    ADD CONSTRAINT users_society_id_fkey
    FOREIGN KEY (society_id)
    REFERENCES societies(id)
    ON DELETE SET NULL;
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_users_city_society
    ON users(city_id, society_id);
  `);

  /* ===================== SOCIETY ACTIVE FLAG ===================== */

  await pool.query(`
    ALTER TABLE societies
    ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_society_active
    ON societies(is_active);
  `);

  /* ===================== BOOKING HARD INDEX ===================== */

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_booking_city_society_status
    ON bookings(city_id, society_id, status);
  `);

};

module.exports.down = async () => {
  console.log('Geo hardening rollback skipped');
};
