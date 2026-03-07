const express = require('express');
const router = express.Router();

const authenticate = require('../../core/middleware/authenticate');
const requirePermission = require('../../shared/middlewares/permission.middleware');

const controller = require('./withdraw.controller');

/* Technician Request */
router.post(
  '/request',
  authenticate,
  requirePermission('request_withdraw'),
  controller.requestWithdraw
);

/* Admin Approve */
router.post(
  '/approve',
  authenticate,
  requirePermission('approve_withdraw'),
  controller.approveWithdraw
);

/* Admin Reject */
router.post(
  '/reject',
  authenticate,
  requirePermission('reject_withdraw'),
  controller.rejectWithdraw
);

module.exports = router;
