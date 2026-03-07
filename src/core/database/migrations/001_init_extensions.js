module.exports.up = async function (pool) {
  await pool.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
};
