const pool = require('../index');

module.exports.up = async () => {

  /* ================= TECHNICIAN SAFETY ================= */

  // Ensure column exists
  await pool.query(`
    ALTER TABLE technicians
    ADD COLUMN IF NOT EXISTS active_bookings INTEGER DEFAULT 0;
  `);

  // Clean null values
  await pool.query(`
    UPDATE technicians
    SET active_bookings = 0
    WHERE active_bookings IS NULL;
  `);

  // Set constraints safely
  await pool.query(`
    ALTER TABLE technicians
    ALTER COLUMN active_bookings SET DEFAULT 0,
    ALTER COLUMN active_bookings SET NOT NULL;
  `);

  // Prevent negative bookings
  await pool.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'check_active_bookings_non_negative'
      ) THEN
        ALTER TABLE technicians
        ADD CONSTRAINT check_active_bookings_non_negative
        CHECK (active_bookings >= 0);
      END IF;
    END
    $$;
  `);

  // Technician status safety
  await pool.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'check_technician_status'
      ) THEN
        ALTER TABLE technicians
        ADD CONSTRAINT check_technician_status
        CHECK (status IN ('AVAILABLE','BUSY','OFFLINE'));
      END IF;
    END
    $$;
  `);

  /* ================= DISPATCH INDEX ================= */

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_dispatch_composite
    ON technicians (status, is_approved, active_bookings);
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_dispatch_available_partial
    ON technicians (active_bookings)
    WHERE status = 'AVAILABLE' AND is_approved = true;
  `);

};

module.exports.down = async () => {
  console.log('Dispatch hardening cannot be safely rolled back.');
};
