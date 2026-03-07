const pool = require('../index');

module.exports.up = async () => {

  await pool.query(`
    CREATE TABLE IF NOT EXISTS withdraw_requests (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      amount NUMERIC(12,2) NOT NULL,
      status VARCHAR(20) DEFAULT 'PENDING',
      requested_at TIMESTAMP DEFAULT NOW(),
      processed_at TIMESTAMP,
      processed_by UUID REFERENCES users(id),
      remarks TEXT
    );
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_withdraw_status
    ON withdraw_requests(status);
  `);
};

module.exports.down = async () => {
  await pool.query(`DROP TABLE IF EXISTS withdraw_requests`);
};
