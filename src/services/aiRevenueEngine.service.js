const pool = require('../core/database');
const { getSetting } = require('../core/config/settings.service');

async function runRevenueAI(){

  const enabled = await getSetting('revenue_ai_enabled');

  if(!enabled){
    return;
  }

  const days =
    Number(await getSetting('revenue_analysis_window_days')) || 7;

  const lowThreshold =
    Number(await getSetting('revenue_low_performance_threshold')) || 5;

  const marginThreshold =
    Number(await getSetting('revenue_high_profit_margin')) || 30;

  const stats = await pool.query(
    `
    SELECT
      service_id,
      COUNT(*) as bookings,
      SUM(total_price) as revenue
    FROM bookings
    WHERE created_at > NOW() - INTERVAL '${days} days'
    GROUP BY service_id
    `
  );

  for(const service of stats.rows){

    const bookings = parseInt(service.bookings);
    const revenue = parseFloat(service.revenue || 0);

    if(bookings < lowThreshold){

      console.log(
        "⚠ Low Performing Service:",
        service.service_id,
        "bookings", bookings
      );

    }

    if(revenue > marginThreshold * 100){

      console.log(
        "💰 High Revenue Service:",
        service.service_id,
        "revenue", revenue
      );

    }

  }

}

module.exports = { runRevenueAI };
