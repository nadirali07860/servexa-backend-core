const pool = require('../index');

module.exports.up = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS technicians (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      is_approved BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_technicians_user_id
    ON technicians(user_id);
  `);
};

module.exports.down = async () => {
  await pool.query(`DROP TABLE IF EXISTS technicians CASCADE;`);
};
