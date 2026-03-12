const pool = require('../core/database');

async function runSLAMonitor() {

  const result = await pool.query(`
    SELECT id, created_at
    FROM bookings
    WHERE status = 'ASSIGNED'
  `);

  const now = Date.now();

  for (const booking of result.rows) {

    const created = new Date(booking.created_at).getTime();
    const diff = (now - created) / 60000;

    if (diff > 30) {

      console.log(
        "⚠ SLA breach booking:",
        booking.id
      );

    }

  }

}

module.exports = { runSLAMonitor };
