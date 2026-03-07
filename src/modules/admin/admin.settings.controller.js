const pool = require('../../core/database');
const logger = require('../../core/logger');

exports.getAllSettings = async (req, res) => {
  try {

    const result = await pool.query(
      `SELECT key, value FROM system_settings ORDER BY key`
    );

    res.json({
      success: true,
      settings: result.rows
    });

  } catch (err) {

    logger.error("Fetch settings failed", {
      error: err.message
    });

    res.status(500).json({
      success: false,
      message: "Failed to fetch settings"
    });
  }
};

exports.updateSetting = async (req, res) => {
  try {

    const { key, value } = req.body;

    const exists = await pool.query(
      `SELECT id FROM system_settings WHERE key=$1`,
      [key]
    );

    if (!exists.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Setting not found"
      });
    }

    await pool.query(
      `UPDATE system_settings SET value=$1 WHERE key=$2`,
      [value, key]
    );

    logger.info("System setting updated", { key });

    res.json({
      success: true,
      message: "Setting updated"
    });

  } catch (err) {

    logger.error("Update setting failed", {
      error: err.message,
      body: req.body
    });

    res.status(500).json({
      success: false,
      message: "Update failed"
    });
  }
};
