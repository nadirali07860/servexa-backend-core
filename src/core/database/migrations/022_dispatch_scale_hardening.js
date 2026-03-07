const pool = require('../index');

module.exports.up = async () => {

  /* ================= TECHNICIAN SAFETY ================= */

  await pool.query(`
    UPDATE technicians
    SET active_bookings = 0
    WHERE active_bookings IS NULL;
  `);

  await pool.query(`
    ALTER TABLE technicians
    ALTER COLUMN active_bookings SET DEFAULT 0,
    ALTER COLUMN active_bookings SET NOT NULL;
  `);

  await pool.query(`
    ALTER TABLE technicians
    ADD CONSTRAINT check_active_bookings_non_negative
    CHECK (active_bookings >= 0);
  `);

  await pool.query(`
    ALTER TABLE technicians
    ADD CONSTRAINT check_technician_status
    CHECK (status IN ('AVAILABLE','BUSY','OFFLINE'));
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
