const pool = require('../../core/database');
const AppError = require('../../shared/utils/AppError');

const requirePermission = (permissionName) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return next(new AppError('Unauthorized', 401));
      }

      const result = await pool.query(`
        SELECT p.name
        FROM users u
        JOIN roles r ON u.role_id = r.id
        JOIN role_permissions rp ON r.id = rp.role_id
        JOIN permissions p ON rp.permission_id = p.id
        WHERE u.id = $1
      `, [userId]);

      const permissions = result.rows.map(r => r.name);

      if (!permissions.includes(permissionName)) {
        return next(new AppError('Forbidden - insufficient permission', 403));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = requirePermission;
