const express = require('express');
const router = express.Router();

const {
  getAIInsights
} = require('./admin.ai.controller');

router.get('/ai-insights', getAIInsights);

module.exports = router;
