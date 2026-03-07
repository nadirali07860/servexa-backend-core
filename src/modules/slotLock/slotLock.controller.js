const service = require('./slotLock.service');

async function lockSlot(req,res){

  try{

    const lock = await service.lockSlot(req.body);

    res.json({
      success:true,
      data:lock
    });

  }catch(err){

    res.status(400).json({
      success:false,
      message:err.message
    });

  }

}

module.exports = {
  lockSlot
};
