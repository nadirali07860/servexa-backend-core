const pool = require('../core/database');

async function runRiskEngine(){

  try{

    const suspiciousUsers = await pool.query(`
      SELECT customer_id,
      COUNT(*) as bookings
      FROM bookings
      WHERE created_at > NOW() - INTERVAL '24 hours'
      GROUP BY customer_id
    `);

    for(const row of suspiciousUsers.rows){

      let riskScore = 0;

      if(row.bookings > 5) riskScore += 30;
      if(row.bookings > 10) riskScore += 60;

      if(riskScore >= 60){

        console.warn(
          "🚨 High Risk User",
          row.customer_id,
          "score", riskScore
        );

      }

    }

  }
  catch(err){

    console.error("Risk engine error", err.message);

  }

}

module.exports = { runRiskEngine };
