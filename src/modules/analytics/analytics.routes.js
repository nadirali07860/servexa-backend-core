const express = require('express');
const router = express.Router();

const controller = require('./analytics.controller');
const authMiddleware = require('../../shared/middlewares/auth.middleware');

router.get(
  '/dashboard',
  authMiddleware.authenticate,
  controller.getDashboardStats
);

module.exports = router;
