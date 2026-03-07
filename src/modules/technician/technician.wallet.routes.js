const express = require('express');
const router = express.Router();

const authenticate = require('../../core/middleware/authenticate');
const attachRoles = require('../../core/middleware/attachRoles');

const controller = require('./technician.wallet.controller');
const adminController = require('./technician.admin.wallet.controller');

router.get('/wallet',
authenticate, attachRoles,
(req,res,next)=>{
if(!req.user.roles.includes('TECHNICIAN'))
return res.status(403).json({success:false,message:"Technician access required"});
next();
}, controller.getWallet);

router.post('/withdraw',
authenticate, attachRoles,
(req,res,next)=>{
if(!req.user.roles.includes('TECHNICIAN'))
return res.status(403).json({success:false,message:"Technician access required"});
next();
}, controller.requestWithdraw);

router.post('/withdraw/approve',
authenticate, attachRoles,
(req,res,next)=>{
if(!req.user.roles.includes('ADMIN') && !req.user.roles.includes('SUPER_ADMIN'))
return res.status(403).json({success:false,message:"Admin access required"});
next();
}, adminController.approveWithdraw);

module.exports = router;
