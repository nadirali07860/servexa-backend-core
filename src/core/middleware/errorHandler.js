const logger = require('../logger');

function errorHandler(err, req, res, next) {
  const statusCode = err.status || 500;

  logger.error('Unhandled error', {
    requestId: req.requestId,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });

  res.status(statusCode).json({
    success: false,
    message:
      process.env.NODE_ENV === 'production'
        ? 'Internal Server Error'
        : err.message,
    requestId: req.requestId,
  });
}

module.exports = errorHandler;
