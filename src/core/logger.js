
const { createLogger, format, transports } = require('winston');
const path = require('path');

const logDir = path.join(__dirname, '../../logs');

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',

  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.json()
  ),

  transports: [

    // Console (development)
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    }),

    // All logs file
    new transports.File({
      filename: path.join(logDir, 'combined.log')
    }),

    // Error only file
    new transports.File({
      level: 'error',
      filename: path.join(logDir, 'errors.log')
    })

  ]
});

module.exports = logger;

