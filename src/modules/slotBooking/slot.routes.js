const router = require('express').Router();
const controller = require('./slot.controller');

router.post('/create',controller.createSlot);

router.get('/:technician_id',controller.getSlots);

module.exports = router;
