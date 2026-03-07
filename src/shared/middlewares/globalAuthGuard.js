const authMiddleware = require('./auth.middleware');

const publicRoutes = [
  '/api/v1/auth/send-otp',
  '/api/v1/auth/verify-otp'
];

module.exports = async (req, res, next) => {

  const path = req.originalUrl;

  const isPublic = publicRoutes.some(route =>
    path.startsWith(route)
  );

  if (isPublic) {
    return next();
  }

  return authMiddleware.authenticate(req, res, next);

};
