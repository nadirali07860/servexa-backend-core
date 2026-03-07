const express = require('express');
const router = express.Router();

const authenticate = require('../../core/middleware/authenticate');
const attachRoles = require('../../core/middleware/attachRoles');

router.get('/admin-only', authenticate, attachRoles, (req, res) => {

  if (!req.user.roles.includes('ADMIN') &&
      !req.user.roles.includes('SUPER_ADMIN')) {
    return res.status(403).json({
      success: false,
      message: "Admin access required"
    });
  }

  res.json({
    success: true,
    message: "Welcome Admin"
  });

});

module.exports = router;
