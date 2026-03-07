const express = require('express');
const router = express.Router();

const authenticate = require('../../core/middleware/authenticate');
const requirePermission = require('../../shared/middlewares/permission.middleware');
const validate = require('../../shared/middlewares/validate.middleware');

const controller = require('./booking.controller');
const {
  createBookingSchema,
  bookingIdSchema
} = require('./booking.validator');

router.post(
  '/create',
  authenticate,
  requirePermission('create_booking'),
  validate(createBookingSchema),
  controller.createBooking
);

router.post(
  '/accept',
  authenticate,
  requirePermission('accept_booking'),
  validate(bookingIdSchema),
  controller.acceptBooking
);

router.post(
  '/start',
  authenticate,
  requirePermission('start_booking'),
  validate(bookingIdSchema),
  controller.startBooking
);

router.post(
  '/complete',
  authenticate,
  requirePermission('complete_booking'),
  validate(bookingIdSchema),
  controller.completeBooking
);

router.post(
  '/reject',
  authenticate,
  requirePermission('reject_booking'),
  validate(bookingIdSchema),
  controller.rejectBooking
);

module.exports = router;
