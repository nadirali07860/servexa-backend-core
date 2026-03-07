const pool = require('../../core/database');
const logger = require('../../core/logger');

exports.registerTechnician = async (req, res) => {
  try {

    const userId = req.user.id;
    const { experience_years, service_area } = req.body;

    const existing = await pool.query(
      `SELECT * FROM technicians WHERE user_id = $1`,
      [userId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Already registered as technician"
      });
    }

    await pool.query(
      `INSERT INTO technicians (user_id, experience_years, service_area)
       VALUES ($1,$2,$3)`,
      [userId, experience_years, service_area]
    );

    logger.info("Technician registration submitted", {
      userId
    });

    return res.json({
      success: true,
      message: "Technician registration submitted for approval"
    });

  } catch (err) {

    logger.error("Technician registration failed", {
      error: err.message,
      userId: req.user?.id
    });

    return res.status(500).json({
      success: false,
      message: "Registration failed"
    });
  }
};
