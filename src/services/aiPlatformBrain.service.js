const pool = require('../core/database');
const { getSetting } = require('../core/config/settings.service');

async function runPlatformBrain(){

  const enabled = await getSetting('platform_brain_enabled');

  if(!enabled){
    return;
  }

  const cityThreshold =
    Number(await getSetting('platform_city_expansion_threshold')) || 200;

  const hiringThreshold =
    Number(await getSetting('platform_hiring_threshold')) || 20;

  const marketingThreshold =
    Number(await getSetting('platform_marketing_threshold')) || 50;

  const demand = await pool.query(`
    SELECT society_id, COUNT(*) as bookings
    FROM bookings
    WHERE created_at > NOW() - INTERVAL '7 days'
    GROUP BY society_id
  `);

  for(const area of demand.rows){

    const bookings = parseInt(area.bookings);

    if(bookings > cityThreshold){
      console.log("🌍 City Expansion Opportunity:", area.society_id);
    }

    if(bookings > hiringThreshold){
      console.log("👨‍🔧 Technician Hiring Needed:", area.society_id);
    }

    if(bookings > marketingThreshold){
      console.log("📢 Marketing Push Recommended:", area.society_id);
    }

  }

}

module.exports = { runPlatformBrain };
