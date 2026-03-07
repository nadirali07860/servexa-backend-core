const express = require('express');
const router = express.Router();

const controller = require('./auth.controller');

// Middlewares
const otpLimiter = require('../../shared/middlewares/otpLimiter');
const validate = require('../../shared/middlewares/validate');

// Validators
const { sendOtpSchema, verifyOtpSchema } = require('../../shared/validators/auth.validator');


/* ================= SEND OTP ================= */
router.post(
  '/send-otp',
  otpLimiter,
  validate(sendOtpSchema),
  controller.sendOtp
);


/* ================= VERIFY OTP ================= */
router.post(
  '/verify-otp',
  otpLimiter,
  validate(verifyOtpSchema),
  controller.verifyOtp
);


module.exports = router;
