
const rateLimit = require('express-rate-limit');


// ================= GLOBAL LIMIT =================
exports.globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false
});


// ================= OTP STRICT LIMIT =================
exports.otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many OTP attempts. Try again later."
  }
});


// ================= ROLE BASED LIMIT =================
exports.roleLimiter = (req, res, next) => {

  if (!req.user || !req.user.roles) {
    return next();
  }

  if (req.user.roles.includes('SUPER_ADMIN')) {
    return next(); // unlimited
  }

  if (req.user.roles.includes('ADMIN')) {
    return rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 500
    })(req, res, next);
  }

  if (req.user.roles.includes('TECHNICIAN')) {
    return rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 150
    })(req, res, next);
  }

  if (req.user.roles.includes('CUSTOMER')) {
    return rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100
    })(req, res, next);
  }

  next();
};

