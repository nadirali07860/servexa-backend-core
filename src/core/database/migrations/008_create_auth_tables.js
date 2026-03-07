const pool = require('../index');

module.exports.up = async () => {

  await pool.query(`
    CREATE TABLE IF NOT EXISTS otp_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      phone VARCHAR(20) NOT NULL,
      otp VARCHAR(10) NOT NULL,
      verified BOOLEAN DEFAULT false,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_otp_phone 
    ON otp_logs(phone);
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      token TEXT NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_refresh_user 
    ON refresh_tokens(user_id);
  `);
};

module.exports.down = async () => {
  await pool.query(`DROP TABLE IF EXISTS refresh_tokens CASCADE;`);
  await pool.query(`DROP TABLE IF EXISTS otp_logs CASCADE;`);
};
