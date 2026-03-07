
const { Pool } = require('pg');
const logger = require('../../core/logger');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect()
  .then(() => {
    logger.info('PostgreSQL connected successfully');
  })
  .catch((err) => {
    logger.error('PostgreSQL connection failed', {
      error: err.message
    });
    process.exit(1);
  });

module.exports = pool;

