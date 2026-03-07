const pool = require('../database');

module.exports = function authorize(permissionName) {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;

      const result = await pool.query(
        `
        SELECT p.name
        FROM permissions p
        JOIN role_permissions rp ON p.id = rp.permission_id
        JOIN user_roles ur ON ur.role_id = rp.role_id
        WHERE ur.user_id = $1 AND p.name = $2
        `,
        [userId, permissionName]
      );

      if (result.rows.length === 0) {
        return res.status(403).json({
          success: false,
          message: "Forbidden"
        });
      }

      next();
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Authorization error"
      });
    }
  };
};
