const repo = require('./technicianSchedule.repository');
const slotGenerator = require('../slotBooking/autoSlot.generator');

async function addSchedule(data){

  const schedule = await repo.createSchedule(data);

  try{

    await slotGenerator.generateSlotsForSchedule({
      technician_id: schedule.technician_id,
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      slot_duration: schedule.slot_duration
    });

  }catch(err){

    console.error("Slot generation failed",err.message);

  }

  return schedule;

}

async function listSchedule(technician_id){

  return repo.getTechnicianSchedule(technician_id);

}

module.exports = {
  addSchedule,
  listSchedule
};
