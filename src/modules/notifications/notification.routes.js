const express = require('express');
const router = express.Router();

const controller = require('./notification.controller');
const authenticate = require('../../shared/middlewares/auth.middleware');

router.post('/send',authenticate,controller.send);

module.exports = router;
