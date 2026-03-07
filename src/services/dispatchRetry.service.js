const pool = require('../core/database');
const logger = require('../core/logger');

const MAX_RETRY = 5;

async function dispatchNextTechnician(bookingId) {

  try {

    const bookingRes = await pool.query(
      `SELECT service_id, society_id, retry_count
       FROM bookings
       WHERE id = $1`,
      [bookingId]
    );

    if (!bookingRes.rows.length) {
      logger.error("Booking not found", { bookingId });
      return;
    }

    const booking = bookingRes.rows[0];

    if (booking.retry_count >= MAX_RETRY) {
      logger.warn("Max dispatch retry reached", { bookingId });
      return;
    }

    const techRes = await pool.query(
      `SELECT id
       FROM technicians
       WHERE service_id = $1
       AND society_id = $2
       AND is_active = true
       ORDER BY rating DESC
       LIMIT 1`,
      [booking.service_id, booking.society_id]
    );

    if (!techRes.rows.length) {
      logger.warn("No technician available", { bookingId });
      return;
    }

    const technicianId = techRes.rows[0].id;

    await pool.query(
      `UPDATE bookings
       SET technician_id = $1,
           retry_count = retry_count + 1
       WHERE id = $2`,
      [technicianId, bookingId]
    );

    logger.info("Technician reassigned", {
      bookingId,
      technicianId
    });

  } catch (error) {

    logger.error("Dispatch retry failed", {
      bookingId,
      error: error.message
    });

  }

}

module.exports = {
  dispatchNextTechnician
};
