const db = require('../../core/database');

async function createSlot(data){

  const { technician_id, slot_start, slot_end } = data;

  const result = await db.query(
    `
    INSERT INTO booking_slots
    (technician_id,slot_start,slot_end)
    VALUES ($1,$2,$3)
    RETURNING *
    `,
    [technician_id,slot_start,slot_end]
  );

  return result.rows[0];

}

async function getAvailableSlots(technician_id){

  const result = await db.query(
    `
    SELECT *
    FROM booking_slots
    WHERE technician_id=$1
    AND is_booked=false
    ORDER BY slot_start
    `,
    [technician_id]
  );

  return result.rows;

}

async function bookSlot(slot_id,booking_id){

  const result = await db.query(
    `
    UPDATE booking_slots
    SET is_booked=true,
    booking_id=$1
    WHERE id=$2
    RETURNING *
    `,
    [booking_id,slot_id]
  );

  return result.rows[0];

}

module.exports = {
  createSlot,
  getAvailableSlots,
  bookSlot
};
