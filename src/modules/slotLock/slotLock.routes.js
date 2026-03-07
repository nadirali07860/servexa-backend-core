const router = require('express').Router();
const controller = require('./slotLock.controller');

router.post('/lock',controller.lockSlot);

module.exports = router;
