const express = require('express');
const router = express.Router();

const { authenticate } = require('../../shared/middlewares/auth.middleware');
const rbac = require('../../shared/middlewares/rbac');

/* ================= Technician Only ================= */

router.get(
  '/technician-only',
  authenticate,
  rbac('technician'),
  (req, res) => {
    res.json({
      success: true,
      message: 'Technician access granted'
    });
  }
);

/* ================= Admin Only ================= */

router.get(
  '/admin-only',
  authenticate,
  rbac('admin'),
  (req, res) => {
    res.json({
      success: true,
      message: 'Admin access granted'
    });
  }
);

module.exports = router;
