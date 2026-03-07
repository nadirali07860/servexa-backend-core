const db = require('../../core/database');

async function generateSlotsForSchedule(schedule){

  const {
    technician_id,
    start_time,
    end_time,
    slot_duration
  } = schedule;

  const start = new Date(start_time);
  const end = new Date(end_time);

  let current = new Date(start);

  const slots = [];

  while(current < end){

    const slotStart = new Date(current);
    const slotEnd = new Date(current);

    slotEnd.setMinutes(slotEnd.getMinutes() + slot_duration);

    if(slotEnd > end) break;

    slots.push({
      technician_id,
      slot_start: slotStart,
      slot_end: slotEnd
    });

    current = slotEnd;
  }

  for(const slot of slots){

    await db.query(
      `
      INSERT INTO booking_slots
      (technician_id,slot_start,slot_end)
      VALUES ($1,$2,$3)
      ON CONFLICT DO NOTHING
      `,
      [slot.technician_id,slot.slot_start,slot.slot_end]
    );

  }

}

module.exports = {
  generateSlotsForSchedule
};
