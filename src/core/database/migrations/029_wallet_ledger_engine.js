exports.up = async (pool) => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS wallet_transactions (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
      refund_id UUID REFERENCES refunds(id) ON DELETE SET NULL,
      type VARCHAR(30) NOT NULL,
      source VARCHAR(50) NOT NULL,
      amount NUMERIC NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_wallet_transactions_user
    ON wallet_transactions(user_id);
  `);
};

exports.down = async (pool) => {
  await pool.query(`DROP TABLE IF EXISTS wallet_transactions;`);
};
