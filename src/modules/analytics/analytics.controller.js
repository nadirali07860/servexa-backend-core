const db = require('../../core/database');

async function getDashboardStats(req, res, next) {
  try {

    const revenue = await db.query(`
      SELECT SUM(total_amount) as revenue
      FROM bookings
      WHERE status='COMPLETED'
    `);

    const bookings = await db.query(`
      SELECT COUNT(*) as total_bookings
      FROM bookings
    `);

    const technicians = await db.query(`
      SELECT technician_id, COUNT(*) as jobs
      FROM bookings
      WHERE status='COMPLETED'
      GROUP BY technician_id
      ORDER BY jobs DESC
      LIMIT 5
    `);

    res.json({
      revenue: revenue.rows[0],
      bookings: bookings.rows[0],
      topTechnicians: technicians.rows
    });

  } catch (err) {
    next(err);
  }
}

module.exports = {
  getDashboardStats
};
