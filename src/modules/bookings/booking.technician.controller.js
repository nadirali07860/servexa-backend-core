const pool = require('../../core/database');
const { autoAssignBooking } = require('./booking.autoAssign.service');
const AppError = require('../../shared/utils/AppError');

async function acceptBooking(req, res) {

  const { bookingId } = req.params;
  const technicianId = req.user.id;

  const result = await pool.query(
    `
    UPDATE bookings
    SET status='ACCEPTED',
        updated_at=NOW()
    WHERE id=$1
    AND technician_id=$2
    `,
    [bookingId, technicianId]
  );

  return res.json({
    success: true,
    message: 'Booking accepted'
  });

}

async function rejectBooking(req, res) {

  const { bookingId } = req.params;
  const technicianId = req.user.id;

  const client = await pool.connect();

  try {

    await client.query('BEGIN');

    const bookingRes = await client.query(
      `
      SELECT *
      FROM bookings
      WHERE id=$1
      FOR UPDATE
      `,
      [bookingId]
    );

    if (!bookingRes.rows.length) {
      throw new AppError('Booking not found', 404);
    }

    const booking = bookingRes.rows[0];

    if (booking.technician_id !== technicianId) {
      throw new AppError('Unauthorized', 403);
    }

    await client.query(
      `
      UPDATE bookings
      SET technician_id=NULL,
          status='CREATED',
          updated_at=NOW()
      WHERE id=$1
      `,
      [bookingId]
    );

    await client.query(
      `
      UPDATE technicians
      SET active_bookings = active_bookings - 1,
          status='AVAILABLE'
      WHERE user_id=$1
      `,
      [technicianId]
    );

    await client.query('COMMIT');

    // Reassign booking
    await autoAssignBooking(bookingId);

    return res.json({
      success: true,
      message: 'Booking rejected and reassigned'
    });

  } catch (err) {

    await client.query('ROLLBACK');
    throw err;

  } finally {

    client.release();

  }

}

module.exports = {
  rejectBooking,
  acceptBooking
};
