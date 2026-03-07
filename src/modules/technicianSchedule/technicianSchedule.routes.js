const router = require('express').Router();
const controller = require('./technicianSchedule.controller');

router.post('/add', controller.addSchedule);

router.get('/:technician_id', controller.getSchedule);

module.exports = router;
