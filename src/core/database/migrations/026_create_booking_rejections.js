exports.up = async (pool) => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS booking_rejections (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
      technician_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE (booking_id, technician_id)
    );
  `);
};

exports.down = async (pool) => {
  await pool.query(`DROP TABLE IF EXISTS booking_rejections;`);
};
