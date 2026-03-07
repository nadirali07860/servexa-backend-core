const withTransaction = require('../../core/database/withTransaction');
const AppError = require('../../shared/utils/AppError');

async function submitRating(data) {
  return withTransaction(async (client) => {

    const { booking_id, customer_id, rating, review } = data;

    if (rating < 1 || rating > 5) {
      throw new AppError('Rating must be between 1 and 5', 400);
    }

    const bookingCheck = await client.query(
      `SELECT technician_id, status
       FROM bookings
       WHERE id=$1`,
      [booking_id]
    );

    if (!bookingCheck.rows.length) {
      throw new AppError('Booking not found', 404);
    }

    if (bookingCheck.rows[0].status !== 'COMPLETED') {
      throw new AppError('Can rate only completed booking', 400);
    }

    const technician_id = bookingCheck.rows[0].technician_id;

    await client.query(
      `INSERT INTO ratings
       (booking_id, customer_id, technician_id, rating, review)
       VALUES ($1,$2,$3,$4,$5)`,
      [booking_id, customer_id, technician_id, rating, review]
    );

    // 🔄 Recalculate technician rating
    const result = await client.query(
      `SELECT COUNT(*) as total,
              AVG(rating) as avg
       FROM ratings
       WHERE technician_id=$1`,
      [technician_id]
    );

    const total = parseInt(result.rows[0].total);
    const avg = parseFloat(result.rows[0].avg).toFixed(2);

    await client.query(
      `UPDATE technicians
       SET average_rating=$1,
           total_ratings=$2
       WHERE user_id=$3`,
      [avg, total, technician_id]
    );

    // 🚨 AUTO SUSPEND LOGIC
    if (total >= 10 && avg < 3.0) {
      await client.query(
        `UPDATE technicians
         SET status='SUSPENDED'
         WHERE user_id=$1`,
        [technician_id]
      );
    }

    return { success: true };
  });
}

module.exports = { submitRating };
