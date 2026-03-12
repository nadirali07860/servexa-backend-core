const pool = require('../core/database');

async function runMarketplaceController(){

try{

/* ----- Booking Growth ----- */

const bookingStats = await pool.query(`
SELECT COUNT(*) as bookings
FROM bookings
WHERE created_at > NOW() - INTERVAL '1 hour'
`);

const bookingsLastHour =
parseInt(bookingStats.rows[0].bookings);


/* ----- Online Technicians ----- */

const techStats = await pool.query(`
SELECT COUNT(*) as techs
FROM technicians
WHERE is_online = true
`);

const onlineTechs =
parseInt(techStats.rows[0].techs);


/* ----- Demand Ratio ----- */

const ratio =
bookingsLastHour / Math.max(onlineTechs,1);


console.log(
"🧠 Marketplace Controller",
"bookings:", bookingsLastHour,
"techs:", onlineTechs,
"ratio:", ratio.toFixed(2)
);


/* ----- AI Decisions ----- */

if(ratio > 4){

console.log(
"⚡ High demand detected — surge likely required"
);

}

if(ratio < 1){

console.log(
"📉 Low demand — technician oversupply"
);

}

}
catch(err){

console.error(
"Marketplace controller error",
err.message
);

}

}

module.exports = { runMarketplaceController };

