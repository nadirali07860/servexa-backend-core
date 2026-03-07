exports.up = async (pool) => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS refunds (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
      customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      technician_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      amount NUMERIC NOT NULL,
      reason TEXT,
      status VARCHAR(20) DEFAULT 'REQUESTED',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);
};

exports.down = async (pool) => {
  await pool.query(`DROP TABLE IF EXISTS refunds;`);
};
