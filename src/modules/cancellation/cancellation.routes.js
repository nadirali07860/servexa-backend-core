const express = require('express');
const router = express.Router();

const controller = require('./cancellation.controller');
const authMiddleware = require('../../shared/middlewares/auth.middleware');

router.post(
  '/cancel',
  authMiddleware.authenticate,
  controller.cancelBooking
);

module.exports = router;
