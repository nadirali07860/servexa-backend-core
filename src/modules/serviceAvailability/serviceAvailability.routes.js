const router = require('express').Router();
const controller = require('./serviceAvailability.controller');

router.post('/add', controller.addAvailability);

router.get('/society/:society_id', controller.getSocietyServices);

module.exports = router;
