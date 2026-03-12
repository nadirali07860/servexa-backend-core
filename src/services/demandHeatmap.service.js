const pool = require('../core/database');
const { getSetting } = require('../core/config/settings.service');

async function runDemandHeatmap(){

  const enabled = await getSetting('heatmap_enabled');

  if(!enabled){
    return {};
  }

  const windowMinutes =
    Number(await getSetting('heatmap_time_window_minutes')) || 60;

  const hotspotThreshold =
    Number(await getSetting('heatmap_hotspot_threshold')) || 10;

  const demand = await pool.query(
    `
    SELECT society_id, COUNT(*) as bookings
    FROM bookings
    WHERE created_at > NOW() - INTERVAL '${windowMinutes} minutes'
    GROUP BY society_id
    `
  );

  const technicians = await pool.query(`
    SELECT sa.society_id, COUNT(*) as technicians
    FROM service_availability sa
    JOIN technicians t
    ON sa.technician_id = t.user_id
    WHERE t.is_online = true
    GROUP BY sa.society_id
  `);

  const heatmap = {};

  for(const d of demand.rows){

    const tech = technicians.rows.find(
      t => t.society_id === d.society_id
    );

    const bookings = parseInt(d.bookings);
    const techCount = tech ? parseInt(tech.technicians) : 0;

    const ratio = bookings / Math.max(techCount,1);

    heatmap[d.society_id] = {
      bookings,
      technicians: techCount,
      demand_ratio: ratio
    };

    if(bookings >= hotspotThreshold){

      console.log(
        "🔥 Heatmap Hotspot:",
        "society", d.society_id,
        "bookings", bookings,
        "technicians", techCount
      );

    }

  }

  return heatmap;

}

module.exports = { runDemandHeatmap };
