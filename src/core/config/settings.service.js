const pool = require('../database');

async function getSetting(key) {
  const result = await pool.query(
    `SELECT value FROM system_settings WHERE key = $1`,
    [key]
  );

  if (!result.rows.length) return null;

  return result.rows[0].value;
}

module.exports = {
  getSetting
};
