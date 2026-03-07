const Joi = require('joi');

/* ================= CREATE BOOKING ================= */

exports.createBookingSchema = Joi.object({
  service_id: Joi.string().uuid().required(),
  society_id: Joi.string().uuid().required(),   // 🔥 ADDED
  address: Joi.string().min(5).max(500).required(),
  scheduled_at: Joi.date().iso().required()
});

/* ================= BOOKING ID ================= */

exports.bookingIdSchema = Joi.object({
  booking_id: Joi.string().uuid().required()
});
