const express = require('express');
const router = express.Router();

const authenticate = require('../../core/middleware/authenticate');
const attachRoles = require('../../core/middleware/attachRoles');

const controller = require('./technician.controller');
const adminController = require('./technician.admin.controller');

router.post('/register', authenticate, controller.registerTechnician);

router.post('/approve',
  authenticate,
  attachRoles,
  (req, res, next) => {
    if (!req.user.roles.includes('ADMIN') &&
        !req.user.roles.includes('SUPER_ADMIN')) {
      return res.status(403).json({
        success: false,
        message: "Admin access required"
      });
    }
    next();
  },
  adminController.approveTechnician
);

module.exports = router;
