const express = require('express');
const router = express.Router();

const controller = require('./services.controller');
const { authenticate, authorize } = require('../../shared/middlewares/auth.middleware');

/* ================= ADMIN ROUTES ================= */

router.post(
  '/category',
  authenticate,
  authorize('ADMIN'),
  controller.createCategory
);

router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  controller.createService
);

router.put(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  controller.updateService
);

/* ================= PUBLIC ROUTES ================= */

router.get('/', controller.getServices);

module.exports = router;
