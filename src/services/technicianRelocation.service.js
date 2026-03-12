const pool = require('../core/database');
const { getSetting } = require('../core/config/settings.service');

async function runRelocationEngine(){

  const enabled = await getSetting('relocation_enabled');

  if(!enabled){
    return;
  }

  const busyThreshold =
    Number(await getSetting('relocation_busy_booking_threshold')) || 8;

  const idleThreshold =
    Number(await getSetting('relocation_min_idle_tech')) || 3;

  const demand = await pool.query(`
    SELECT society_id, COUNT(*) as bookings
    FROM bookings
    WHERE created_at > NOW() - INTERVAL '30 minutes'
    GROUP BY society_id
  `);

  for(const area of demand.rows){

    const bookings = parseInt(area.bookings);

    if(bookings < busyThreshold){
      continue;
    }

    const idleTech = await pool.query(
      `SELECT user_id
       FROM technicians
       WHERE society_id != $1
       AND is_online = true
       AND active_bookings = 0
       LIMIT $2`,
      [area.society_id, idleThreshold]
    );

    if(!idleTech.rows.length){
      continue;
    }

    for(const tech of idleTech.rows){

      console.log(
        "AI Relocation:",
        tech.user_id,
        "→ move to society",
        area.society_id
      );

    }

  }

}

module.exports = { runRelocationEngine };
