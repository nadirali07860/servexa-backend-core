exports.up = async (pool) => {
  // Drop old platform_earnings table
  await pool.query(`
    DROP TABLE IF EXISTS platform_earnings;
  `);

  // Create new ledger-style platform earnings table
  await pool.query(`
    CREATE TABLE platform_earnings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
      type VARCHAR(10) NOT NULL CHECK (type IN ('CREDIT','DEBIT')),
      source VARCHAR(50) NOT NULL,
      amount NUMERIC(14,2) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
};

exports.down = async (pool) => {
  await pool.query(`DROP TABLE IF EXISTS platform_earnings;`);
};
