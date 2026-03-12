const pool = require('../core/database');
const { getSetting } = require('../core/config/settings.service');

async function runBusinessIntelligence(){

  const enabled = await getSetting('bi_engine_enabled');

  if(!enabled){
    return;
  }

  const days =
    Number(await getSetting('bi_analysis_window_days')) || 7;

  const topLimit =
    Number(await getSetting('bi_top_service_limit')) || 5;

  const lowThreshold =
    Number(await getSetting('bi_alert_low_booking_threshold')) || 5;

  const revenue = await pool.query(
    `
    SELECT
      COUNT(*) as bookings,
      SUM(total_price) as revenue
    FROM bookings
    WHERE created_at > NOW() - INTERVAL '${days} days'
    `
  );

  console.log("📊 Platform Summary:", revenue.rows[0]);

  const topServices = await pool.query(
    `
    SELECT service_id, COUNT(*) as bookings
    FROM bookings
    WHERE created_at > NOW() - INTERVAL '${days} days'
    GROUP BY service_id
    ORDER BY bookings DESC
    LIMIT $1
    `,
    [topLimit]
  );

  console.log("🏆 Top Services:", topServices.rows);

  const lowServices = await pool.query(
    `
    SELECT service_id, COUNT(*) as bookings
    FROM bookings
    WHERE created_at > NOW() - INTERVAL '${days} days'
    GROUP BY service_id
    HAVING COUNT(*) < $1
    `,
    [lowThreshold]
  );

  for(const service of lowServices.rows){

    console.log(
      "⚠ Low Performing Service:",
      service.service_id,
      "bookings", service.bookings
    );

  }

}

module.exports = { runBusinessIntelligence };
