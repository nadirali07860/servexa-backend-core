const express = require('express');
const router = express.Router();

const { technicianReject } = require('./dispatch.controller');
const { rejectBooking } = require('./reject.controller');

router.post('/reject', technicianReject);

router.post('/reject', rejectBooking);

module.exports = router;
