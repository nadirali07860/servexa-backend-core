const repo = require('./slot.repository');

async function generateSlot(data){
  return repo.createSlot(data);
}

async function listSlots(technician_id){
  return repo.getAvailableSlots(technician_id);
}

async function reserveSlot(slot_id,booking_id){
  return repo.bookSlot(slot_id,booking_id);
}

module.exports = {
  generateSlot,
  listSlots,
  reserveSlot
};
