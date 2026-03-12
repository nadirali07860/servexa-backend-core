const pool = require('../core/database');
const { getSetting } = require('../core/config/settings.service');

async function calculateTechnicianIncentive(demand, technicians){

  const enabled = await getSetting('incentive_enabled');

  if(!enabled){
    return 0;
  }

  const r1 = Number(await getSetting('incentive_level1_ratio')) || 1.2;
  const r2 = Number(await getSetting('incentive_level2_ratio')) || 1.5;
  const r3 = Number(await getSetting('incentive_level3_ratio')) || 2;

  const b1 = Number(await getSetting('incentive_level1_bonus')) || 50;
  const b2 = Number(await getSetting('incentive_level2_bonus')) || 100;
  const b3 = Number(await getSetting('incentive_level3_bonus')) || 200;

  const ratio = demand / Math.max(technicians,1);

  let bonus = 0;

  if(ratio >= r1){
    bonus = b1;
  }

  if(ratio >= r2){
    bonus = b2;
  }

  if(ratio >= r3){
    bonus = b3;
  }

  return bonus;

}

async function triggerIncentives(){

  const demandData = await pool.query(`
    SELECT society_id, COUNT(*) as bookings
    FROM bookings
    WHERE created_at > NOW() - INTERVAL '20 minutes'
    GROUP BY society_id
  `);

  for(const area of demandData.rows){

    const techData = await pool.query(
      `SELECT COUNT(*) as technicians
       FROM technicians
       WHERE society_id=$1 AND is_online=true`,
      [area.society_id]
    );

    const technicians = parseInt(techData.rows[0].technicians);

    const bonus = await calculateTechnicianIncentive(
      parseInt(area.bookings),
      technicians
    );

    if(bonus > 0){
      console.log(
        "AI incentive triggered:",
        area.society_id,
        "bonus:", bonus
      );
    }

  }

}

module.exports = {
  calculateTechnicianIncentive,
  triggerIncentives
};
