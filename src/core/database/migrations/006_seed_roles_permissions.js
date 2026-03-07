const pool = require('../index');

module.exports.up = async () => {
  /* ================= ROLES ================= */

  const roles = [
    'admin',
    'super_admin',
    'technician',
    'customer'
  ];

  const roleMap = {};

  for (const role of roles) {
    const result = await pool.query(
      `INSERT INTO roles (name)
       VALUES ($1)
       ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
       RETURNING id`,
      [role]
    );
    roleMap[role] = result.rows[0].id;
  }

  /* ================= PERMISSIONS ================= */

  const permissions = [
    'create_booking',
    'assign_booking',
    'accept_booking',
    'start_booking',
    'complete_booking',
    'manage_users',
    'manage_roles',
    'view_dashboard'
  ];

  const permissionMap = {};

  for (const perm of permissions) {
    const result = await pool.query(
      `INSERT INTO permissions (name)
       VALUES ($1)
       ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
       RETURNING id`,
      [perm]
    );
    permissionMap[perm] = result.rows[0].id;
  }

  /* ================= ROLE ASSIGNMENTS ================= */

  const assignments = [

    // Admin
    ['admin', 'assign_booking'],
    ['admin', 'manage_users'],
    ['admin', 'view_dashboard'],

    // Super Admin
    ['super_admin', 'manage_users'],
    ['super_admin', 'manage_roles'],
    ['super_admin', 'view_dashboard'],

    // Customer
    ['customer', 'create_booking'],

    // Technician
    ['technician', 'accept_booking'],
    ['technician', 'start_booking'],
    ['technician', 'complete_booking']

  ];

  for (const [roleName, permName] of assignments) {
    const roleId = roleMap[roleName];
    const permId = permissionMap[permName];

    if (roleId && permId) {
      await pool.query(
        `INSERT INTO role_permissions (role_id, permission_id)
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [roleId, permId]
      );
    }
  }
};

module.exports.down = async () => {};
