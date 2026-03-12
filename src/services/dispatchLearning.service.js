const pool = require('../core/database');

async function runDispatchLearning(){

  try{

    const technicians = await pool.query(`
      SELECT 
        t.user_id as technician_id,
        COUNT(b.id) as total_jobs,
        SUM(CASE WHEN b.status='COMPLETED' THEN 1 ELSE 0 END) as completed_jobs,
        AVG(b.rating) as avg_rating
      FROM technicians t
      LEFT JOIN bookings b 
      ON b.technician_id = t.user_id
      GROUP BY t.user_id
    `);

    for(const tech of technicians.rows){

      const total = parseInt(tech.total_jobs) || 0;
      const completed = parseInt(tech.completed_jobs) || 0;
      const rating = parseFloat(tech.avg_rating) || 0;

      let completionRate = 0;

      if(total > 0){
        completionRate = completed / total;
      }

      const score =
        (completionRate * 60) +
        (rating * 8);

      console.log(
        "🤖 Dispatch AI Score",
        tech.technician_id,
        "score:",
        score.toFixed(2)
      );

    }

  }
  catch(err){

    console.error("Dispatch learning engine error", err.message);

  }

}

module.exports = { runDispatchLearning };
