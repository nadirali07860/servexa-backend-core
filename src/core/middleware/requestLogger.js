const { v4: uuidv4 } = require('uuid');
const logger = require('../logger');

module.exports = (req, res, next) => {
  const requestId = uuidv4();

  req.requestId = requestId;

  res.setHeader('X-Request-Id', requestId);

  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;

    logger.info('API Request', {
      requestId,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userId: req.user?.id || null
    });
  });

  next();
};
