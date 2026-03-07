const pool = require('../database');

module.exports = async function attachRoles(req, res, next) {
  try {
    const userId = req.user.id;

    const roles = await pool.query(
      `SELECT r.name
       FROM roles r
       JOIN user_roles ur ON r.id = ur.role_id
       WHERE ur.user_id = $1`,
      [userId]
    );

    req.user.roles = roles.rows.map(r => r.name);
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to load user roles"
    });
  }
};
