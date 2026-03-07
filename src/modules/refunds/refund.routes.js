const express = require('express');
const router = express.Router();

const authenticate = require('../../core/middleware/authenticate');
const requirePermission = require('../../shared/middlewares/permission.middleware');
const validate = require('../../shared/middlewares/validate.middleware');

const controller = require('./refund.controller');
const {
  requestRefundSchema,
  refundActionSchema
} = require('./refund.validator');

/* =========================
   CUSTOMER
========================= */
router.post(
  '/request',
  authenticate,
  requirePermission('request_refund'),
  validate(requestRefundSchema),
  controller.requestRefund
);

/* =========================
   ADMIN
========================= */
router.post(
  '/approve',
  authenticate,
  requirePermission('approve_refund'),
  validate(refundActionSchema),
  controller.approveRefund
);

router.post(
  '/reject',
  authenticate,
  requirePermission('reject_refund'),
  validate(refundActionSchema),
  controller.rejectRefund
);

module.exports = router;
