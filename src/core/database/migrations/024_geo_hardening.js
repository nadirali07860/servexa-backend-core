const pool = require('../index');

module.exports.up = async () => {

  /* ---------- CREATE SOCIETIES TABLE SAFELY ---------- */

  await pool.query(`
    CREATE TABLE IF NOT EXISTS societies (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT,
      city TEXT,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  /* ---------- USERS SOCIETY LINK ---------- */

  await pool.query(`
    ALTER TABLE users
    ADD COLUMN IF NOT EXISTS society_id UUID;
  `);

  await pool.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE constraint_name = 'users_society_id_fkey'
      ) THEN
        ALTER TABLE users
        ADD CONSTRAINT users_society_id_fkey
        FOREIGN KEY (society_id)
        REFERENCES societies(id)
        ON DELETE SET NULL;
      END IF;
    END
    $$;
  `);

  /* ---------- INDEX ---------- */

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_users_city_society
    ON users(city_id, society_id);
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_society_active
    ON societies(is_active);
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_booking_city_society_status
    ON bookings(city_id, society_id, status);
  `);

};

module.exports.down = async () => {
  console.log('Geo hardening rollback skipped');
};
