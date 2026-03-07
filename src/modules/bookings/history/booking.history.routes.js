const express = require('express');
const router = express.Router();

const authenticate = require('../../../core/middleware/authenticate');
const requirePermission = require('../../../shared/middlewares/permission.middleware');

const controller = require('./booking.history.controller');

/* Customer History */
router.get(
  '/customer',
  authenticate,
  requirePermission('view_customer_bookings'),
  controller.customerHistory
);

/* Technician History */
router.get(
  '/technician',
  authenticate,
  requirePermission('view_technician_bookings'),
  controller.technicianHistory
);

module.exports = router;
