const asyncHandler = require('../../shared/utils/asyncHandler');
const bookingService = require('./booking.service');
const { smartDispatch } = require('./booking.smartDispatch.service');

exports.createBooking = asyncHandler(async (req, res) => {
  res.json(await bookingService.createBooking(req.user, req.body));
});

exports.acceptBooking = asyncHandler(async (req, res) => {
  res.json(await bookingService.acceptBooking(
    req.body.booking_id,
    req.user.id,
    req.user.role
  ));
});

exports.startBooking = asyncHandler(async (req, res) => {
  res.json(await bookingService.startBooking(
    req.body.booking_id,
    req.user.id,
    req.user.role
  ));
});

exports.completeBooking = asyncHandler(async (req, res) => {
  res.json(await bookingService.completeBooking(
    req.body.booking_id,
    req.user.id,
    req.user.role
  ));
});

exports.rejectBooking = asyncHandler(async (req, res) => {
  res.json(await bookingService.rejectBooking(
    req.body.booking_id,
    req.user.id,
    req.user.role
  ));
});
