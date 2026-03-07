const express = require('express');
const router = express.Router();
const authenticate = require('../../core/middleware/authenticate');
const controller = require('./user.controller');

router.get('/me', authenticate, controller.getProfile);

module.exports = router;
