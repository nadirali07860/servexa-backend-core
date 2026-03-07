const express = require('express');
const router = express.Router();

const { submitRating } = require('./rating.controller');
const { authenticate } = require('../../shared/middlewares/auth.middleware');

router.post('/submit', authenticate, submitRating);

module.exports = router;
