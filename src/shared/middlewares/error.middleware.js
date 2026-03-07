
const logger = require('../../core/logger');

module.exports = (err, req, res, next) => {

  logger.error("Unhandled Error", {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    body: req.body,
    user: req.user ? req.user.id : null,
    ip: req.ip
  });

  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production'
      ? "Internal Server Error"
      : err.message
  });
};

