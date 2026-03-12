const pool = require('../core/database');

async function runTechnicianReputation(){

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

const reputationScore =
(completionRate * 60) +
(rating * 10);

await pool.query(

`
INSERT INTO technician_reputation
(technician_id, completion_rate, avg_rating, total_jobs, reputation_score)

VALUES($1,$2,$3,$4,$5)

ON CONFLICT (technician_id)

DO UPDATE SET

completion_rate = $2,
avg_rating = $3,
total_jobs = $4,
reputation_score = $5,
updated_at = NOW()
`,
[
tech.technician_id,
completionRate,
rating,
total,
reputationScore
]

);

console.log(
"⭐ Reputation Updated",
tech.technician_id,
"score",
reputationScore.toFixed(2)
);

}

}
catch(err){

console.error("Reputation engine error", err.message);

}

}

module.exports = { runTechnicianReputation };
