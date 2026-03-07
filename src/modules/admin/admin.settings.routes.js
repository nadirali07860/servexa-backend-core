const express = require('express');
const router = express.Router();

const authenticate = require('../../core/middleware/authenticate');
const attachRoles = require('../../core/middleware/attachRoles');
const controller = require('./admin.settings.controller');

router.get('/settings',
authenticate,
attachRoles,
(req,res,next)=>{
if(!req.user.roles.includes('ADMIN') && !req.user.roles.includes('SUPER_ADMIN'))
return res.status(403).json({success:false,message:"Admin access required"});
next();
},
controller.getAllSettings);

router.post('/settings/update',
authenticate,
attachRoles,
(req,res,next)=>{
if(!req.user.roles.includes('ADMIN') && !req.user.roles.includes('SUPER_ADMIN'))
return res.status(403).json({success:false,message:"Admin access required"});
next();
},
controller.updateSetting);

module.exports = router;
