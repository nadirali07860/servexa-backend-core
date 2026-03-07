const pool = require('../index');

module.exports.up = async () => {

  await pool.query(`
    CREATE TABLE IF NOT EXISTS booking_status_history (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

      booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
      old_status VARCHAR(30),
      new_status VARCHAR(30),

      changed_by UUID REFERENCES users(id) ON DELETE SET NULL,
      changed_role VARCHAR(30),

      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_history_booking
    ON booking_status_history(booking_id);
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_history_created
    ON booking_status_history(created_at);
  `);
};

module.exports.down = async () => {
  await pool.query(`DROP TABLE IF EXISTS booking_status_history CASCADE`);
};
