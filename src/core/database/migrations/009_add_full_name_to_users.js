const pool = require('../index');

module.exports.up = async () => {
  await pool.query(`
    ALTER TABLE users
    ADD COLUMN IF NOT EXISTS full_name VARCHAR(255);
  `);
};

module.exports.down = async () => {
  await pool.query(`
    ALTER TABLE users
    DROP COLUMN IF EXISTS full_name;
  `);
};
