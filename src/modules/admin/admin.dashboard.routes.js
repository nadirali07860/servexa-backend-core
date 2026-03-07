const express = require('express');
const router = express.Router();

const authenticate = require('../../core/middleware/authenticate');
const requirePermission = require('../../shared/middlewares/permission.middleware');
const controller = require('./admin.dashboard.controller');

router.get(
  '/dashboard',
  authenticate,
  requirePermission('manage_users'),
  controller.getDashboard
);

module.exports = router;
