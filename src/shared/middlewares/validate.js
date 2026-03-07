const logger = require('../../core/logger');

const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map(detail => detail.message);

      logger.warn('Validation failed', {
        requestId: req.requestId,
        errors,
      });

      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors,
        requestId: req.requestId,
      });
    }

    req[property] = value;
    next();
  };
};

module.exports = validate;
