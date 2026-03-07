
const logger = require('./logger');

const requiredEnv = [
  'DATABASE_URL',
  'JWT_SECRET'
];

module.exports = () => {

  const missing = requiredEnv.filter(env => !process.env[env]);

  if (missing.length > 0) {
    logger.error('Missing required environment variables', { missing });
    process.exit(1);
  }

  logger.info('Environment validated successfully');
};
