const express = require('express');
const router = express.Router();

const controller = require('./reschedule.controller');
const authMiddleware = require('../../shared/middlewares/auth.middleware');

router.post(
  '/reschedule',
  authMiddleware.authenticate,
  controller.rescheduleBooking
);

module.exports = router;
