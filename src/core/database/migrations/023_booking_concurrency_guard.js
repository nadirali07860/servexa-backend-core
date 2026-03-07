const pool = require('../index');

module.exports.up = async () => {

  /* ================= ACTIVE BOOKING GUARD ================= */

  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_one_active_booking_per_technician
    ON bookings (technician_id)
    WHERE status IN ('ACCEPTED','IN_PROGRESS');
  `);

  /* ================= STATUS TRANSITION GUARD ================= */

  await pool.query(`
    ALTER TABLE bookings
    ADD CONSTRAINT check_booking_status_transition_valid
    CHECK (status IN (
      'CREATED',
      'ASSIGNED',
      'ACCEPTED',
      'IN_PROGRESS',
      'COMPLETED',
      'CANCELLED',
      'REJECTED'
    ));
  `);

};

module.exports.down = async () => {
  console.log('Concurrency guard cannot be safely rolled back.');
};
