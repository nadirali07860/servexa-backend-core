const service = require('./technicianSchedule.service');

async function addSchedule(req,res){

  try{

    const schedule = await service.addSchedule(req.body);

    res.json({
      success:true,
      data:schedule
    });

  }catch(err){

    res.status(500).json({
      success:false,
      message:err.message
    });

  }

}

async function getSchedule(req,res){

  const { technician_id } = req.params;

  const schedule = await service.listSchedule(technician_id);

  res.json({
    success:true,
    data:schedule
  });

}

module.exports = {
  addSchedule,
  getSchedule
};
