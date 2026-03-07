const Joi = require('joi');

/* ================= SEND OTP ================= */

const sendOtpSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid phone number format',
      'any.required': 'Phone number is required',
    }),
});

/* ================= VERIFY OTP ================= */

const verifyOtpSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required(),

  otp: Joi.string()
    .length(6)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      'string.length': 'OTP must be 6 digits',
      'string.pattern.base': 'OTP must be numeric',
    }),

  name: Joi.string()
    .min(2)
    .max(50)
    .optional(),

  role: Joi.string()
    .valid('customer', 'technician')
    .required()
    .messages({
      'any.only': 'Role must be either customer or technician',
      'any.required': 'Role is required',
    }),
});

module.exports = {
  sendOtpSchema,
  verifyOtpSchema,
};
