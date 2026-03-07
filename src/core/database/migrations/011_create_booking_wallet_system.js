const pool = require('../index');

module.exports.up = async () => {

  // ================= BOOKINGS =================
  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

      customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      technician_id UUID REFERENCES users(id) ON DELETE SET NULL,

      service_id UUID,
      base_price_snapshot NUMERIC(12,2),
      visit_charge_snapshot NUMERIC(12,2),

      commission_percent_snapshot NUMERIC(5,2),
      commission_amount NUMERIC(12,2),
      technician_earning NUMERIC(12,2),

      status VARCHAR(30) NOT NULL DEFAULT 'CREATED',

      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_booking_status
    ON bookings(status);
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_booking_technician
    ON bookings(technician_id);
  `);

  // ================= WALLETS =================
  await pool.query(`
    CREATE TABLE IF NOT EXISTS wallets (
      user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      balance NUMERIC(14,2) DEFAULT 0,
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);

  // ================= WALLET TRANSACTIONS =================
  await pool.query(`
    CREATE TABLE IF NOT EXISTS wallet_transactions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
      amount NUMERIC(14,2),
      type VARCHAR(20),
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_wallet_user
    ON wallet_transactions(user_id);
  `);

  // ================= PLATFORM EARNINGS =================
  await pool.query(`
    CREATE TABLE IF NOT EXISTS platform_earnings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
      amount NUMERIC(14,2),
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
};

module.exports.down = async () => {
  await pool.query(`DROP TABLE IF EXISTS platform_earnings CASCADE`);
  await pool.query(`DROP TABLE IF EXISTS wallet_transactions CASCADE`);
  await pool.query(`DROP TABLE IF EXISTS wallets CASCADE`);
  await pool.query(`DROP TABLE IF EXISTS bookings CASCADE`);
};
