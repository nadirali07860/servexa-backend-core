const pool = require('../../core/database');

exports.getDashboard = async (req, res) => {
  try {

    const totalBookings = await pool.query(
      `SELECT COUNT(*) FROM bookings`
    );

    const completedBookings = await pool.query(
      `SELECT COUNT(*) FROM bookings WHERE status='COMPLETED'`
    );

    const pendingBookings = await pool.query(
      `SELECT COUNT(*) FROM bookings WHERE status!='COMPLETED'`
    );

    const platformRevenue = await pool.query(
      `SELECT COALESCE(SUM(amount),0) FROM platform_earnings`
    );

    const technicianBalance = await pool.query(
      `SELECT COALESCE(SUM(balance),0) FROM wallets`
    );

    const pendingWithdraw = await pool.query(
      `SELECT COALESCE(SUM(amount),0)
       FROM withdraw_requests
       WHERE status='PENDING'`
    );

    const activeTechnicians = await pool.query(
      `SELECT COUNT(*) FROM technicians WHERE approved=true`
    );

    res.json({
      success: true,
      data: {
        total_bookings: parseInt(totalBookings.rows[0].count),
        completed_bookings: parseInt(completedBookings.rows[0].count),
        pending_bookings: parseInt(pendingBookings.rows[0].count),
        total_platform_revenue: parseFloat(platformRevenue.rows[0].coalesce),
        total_technician_balance: parseFloat(technicianBalance.rows[0].coalesce),
        pending_withdraw_amount: parseFloat(pendingWithdraw.rows[0].coalesce),
        active_technicians: parseInt(activeTechnicians.rows[0].count)
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Dashboard fetch failed"
    });
  }
};
