const pool = require('../../core/database');

async function getAIInsights(req, res) {

  const revenue = await pool.query(`
    SELECT SUM(platform_commission)
    FROM bookings
    WHERE status = 'COMPLETED'
  `);

  const bookings = await pool.query(`
    SELECT COUNT(*)
    FROM bookings
  `);

  res.json({
    revenue: revenue.rows[0].sum,
    bookings: bookings.rows[0].count
  });

}

module.exports = { getAIInsights };
