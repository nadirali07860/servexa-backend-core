const Joi = require('joi');

exports.requestRefundSchema = Joi.object({
  booking_id: Joi.string().uuid().required(),
  reason: Joi.string().min(5).max(500).required()
});

exports.refundActionSchema = Joi.object({
  refund_id: Joi.string().uuid().required()
});
