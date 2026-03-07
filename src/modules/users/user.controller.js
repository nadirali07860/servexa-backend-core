const pool = require('../../core/database');

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT id, full_name, phone, email, status, created_at
       FROM users
       WHERE id = $1`,
      [userId]
    );

    return res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile"
    });
  }
};
