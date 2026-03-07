const pool = require('../../core/database');

async function autoAssignBooking(bookingId) {

  const techRes = await pool.query(
    `
    SELECT user_id
    FROM technicians
    WHERE status='AVAILABLE'
    AND is_online=true
    ORDER BY active_bookings ASC
    LIMIT 1
    `
  );

  if (!techRes.rows.length) {
    console.log('No online technician available');
    return;
  }

  const technicianId = techRes.rows[0].user_id;

  await pool.query(
    `
    UPDATE bookings
    SET technician_id=$1,
        status='ASSIGNED',
        updated_at=NOW()
    WHERE id=$2
    `,
    [technicianId, bookingId]
  );

  await pool.query(
    `
    UPDATE technicians
    SET active_bookings = active_bookings + 1,
        status='BUSY'
    WHERE user_id=$1
    `,
    [technicianId]
  );

  console.log('Booking assigned to technician', technicianId);

}

module.exports = {
  autoAssignBooking
};
