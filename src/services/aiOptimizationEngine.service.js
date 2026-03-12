const pool = require('../core/database');
const { getSetting } = require('../core/config/settings.service');

async function runOptimizationEngine(){

  const enabled = await getSetting('optimization_engine_enabled');

  if(!enabled){
    return;
  }

  const hours =
    Number(await getSetting('optimization_analysis_window_hours')) || 24;

  const demandThreshold =
    Number(await getSetting('optimization_high_demand_threshold')) || 25;

  const techThreshold =
    Number(await getSetting('optimization_low_supply_threshold')) || 3;

  const maxSurge =
    Number(await getSetting('optimization_max_surge_multiplier')) || 2;

  const demand = await pool.query(
    `
    SELECT society_id, COUNT(*) as bookings
    FROM bookings
    WHERE created_at > NOW() - INTERVAL '${hours} hours'
    GROUP BY society_id
    `
  );

  for(const area of demand.rows){

    const bookings = parseInt(area.bookings);

    if(bookings < demandThreshold){
      continue;
    }

    const tech = await pool.query(
      `
      SELECT COUNT(*) as technicians
      FROM technicians
      WHERE society_id=$1
      `,
      [area.society_id]
    );

    const technicians =
      parseInt(tech.rows[0].technicians);

    if(technicians < techThreshold){

      const surgeMultiplier =
        Math.min(1 + (bookings / demandThreshold) * 0.5, maxSurge);

      console.log(
        "⚙ Optimization Action:",
        "society", area.society_id,
        "surge", surgeMultiplier.toFixed(2)
      );

    }

  }

}

module.exports = { runOptimizationEngine };
