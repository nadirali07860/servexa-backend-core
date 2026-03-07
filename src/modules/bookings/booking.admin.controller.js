const pool = require('../../core/database');
const AppError = require('../../shared/utils/AppError');

exports.assignTechnician = async (req, res) => {
  const client = await pool.connect();

  try {
    const { booking_id, technician_id } = req.body;

    await client.query('BEGIN');

    const booking = await client.query(
      `SELECT * FROM bookings WHERE id=$1 FOR UPDATE`,
      [booking_id]
    );

    if (!booking.rows.length) {
      throw new AppError('Booking not found', 404);
    }

    const techCheck = await client.query(
      `SELECT status FROM technicians 
       WHERE user_id=$1 FOR UPDATE`,
      [technician_id]
    );

    if (!techCheck.rows.length) {
      throw new AppError('Technician not found', 404);
    }

    if (techCheck.rows[0].status === 'SUSPENDED') {
      throw new AppError('Cannot assign suspended technician', 403);
    }

    await client.query(
      `UPDATE bookings
       SET technician_id=$1,
           status='ASSIGNED',
           updated_at=NOW()
       WHERE id=$2`,
      [technician_id, booking_id]
    );

    await client.query('COMMIT');

    return res.json({
      success: true,
      message: 'Technician assigned successfully'
    });

  } catch (err) {
    await client.query('ROLLBACK');
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Assignment failed'
    });
  } finally {
    client.release();
  }
};
