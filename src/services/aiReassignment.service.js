const pool = require('../core/database');
const { findBestTechnician } = require('./smartDispatch.service');

async function runReassignmentEngine() {

  const result = await pool.query(`
    SELECT id, service_id, society_id, latitude, longitude
    FROM bookings
    WHERE status = 'REJECTED'
    OR status = 'UNASSIGNED'
    LIMIT 20
  `);

  for (const booking of result.rows) {

    const tech = await findBestTechnician(
      booking.service_id,
      booking.society_id,
      booking.latitude,
      booking.longitude
    );

    if (!tech) continue;

    await pool.query(
      `
      UPDATE bookings
      SET technician_id = $1,
      status = 'ASSIGNED'
      WHERE id = $2
      `,
      [tech.id, booking.id]
    );

  }

}

module.exports = { runReassignmentEngine };
