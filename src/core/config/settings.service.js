const pool = require('../database');
const redis = require('../redis');

async function getSetting(key) {

  const cached = await redis.get(`setting:${key}`);

  if (cached) return JSON.parse(cached);

  const result = await pool.query(
    'SELECT value FROM system_settings WHERE key=$1',
    [key]
  );

  if (!result.rows.length) return null;

  const value = result.rows[0].value;

  await redis.set(`setting:${key}`, JSON.stringify(value));

  return value;

}



async function setSetting(key, value) {

  const result = await pool.query(
    `
    INSERT INTO system_settings (key,value)
    VALUES ($1,$2)
    ON CONFLICT (key)
    DO UPDATE SET value=$2
    RETURNING *
    `,
    [key,value]
  );

  await redis.del(`setting:${key}`);

  return result.rows[0];

}



async function getAllSettings() {

  const result = await pool.query(
    'SELECT key,value FROM system_settings'
  );

  return result.rows;

}



async function deleteSetting(key){

  await pool.query(
    'DELETE FROM system_settings WHERE key=$1',
    [key]
  );

  await redis.del(`setting:${key}`);

}



module.exports = {
  getSetting,
  setSetting,
  getAllSettings,
  deleteSetting
};
