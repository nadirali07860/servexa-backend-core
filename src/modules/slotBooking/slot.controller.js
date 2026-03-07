const service = require('./slot.service');

async function createSlot(req,res){

  try{

    const slot = await service.generateSlot(req.body);

    res.json({
      success:true,
      data:slot
    });

  }catch(err){

    res.status(500).json({
      success:false,
      message:err.message
    });

  }

}

async function getSlots(req,res){

  const { technician_id } = req.params;

  const slots = await service.listSlots(technician_id);

  res.json({
    success:true,
    data:slots
  });

}

module.exports = {
  createSlot,
  getSlots
};
