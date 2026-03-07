const express = require('express');
const router = express.Router();

const authenticate = require('../../core/middleware/authenticate');
const attachRoles = require('../../core/middleware/attachRoles');
const { updateLocation } = require('./technician.location.controller');

const { rejectBooking, acceptBooking } =
require('../bookings/booking.technician.controller');

router.post(
  '/booking/:bookingId/accept',
  authenticate,
  attachRoles,
  acceptBooking
);

router.post(
  '/booking/:bookingId/reject',
  authenticate,
  attachRoles,
  rejectBooking
);

router.post('/location/update', updateLocation);

router.get(
  '/dashboard',
  authenticate,
  attachRoles,
  (req, res) => {

    if (!req.user.roles.includes('TECHNICIAN')) {
      return res.status(403).json({
        success: false,
        message: "Technician access required"
      });
    }

    res.json({
      success: true,
      message: "Welcome Technician",
      roles: req.user.roles
    });

  }
);

module.exports = router;
