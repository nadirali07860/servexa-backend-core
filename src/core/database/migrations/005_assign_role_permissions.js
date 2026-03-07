module.exports.up = async function (pool) {

  // Get role IDs
  const roles = await pool.query(`SELECT id, name FROM roles`);
  const permissions = await pool.query(`SELECT id, name FROM permissions`);

  const roleMap = {};
  roles.rows.forEach(r => roleMap[r.name] = r.id);

  const permissionMap = {};
  permissions.rows.forEach(p => permissionMap[p.name] = p.id);

  const assignments = [

    // Admin - full access
    ['admin', 'manage_users'],
    ['admin', 'manage_bookings'],
    ['admin', 'manage_services'],
    ['admin', 'manage_wallet'],

    // Customer
    ['customer', 'create_booking'],
    ['customer', 'view_own_bookings'],

    // Technician
    ['technician', 'accept_booking'],
    ['technician', 'complete_booking']

  ];

  for (const [roleName, permName] of assignments) {
    const roleId = roleMap[roleName];
    const permId = permissionMap[permName];

    if (roleId && permId) {
      await pool.query(`
        INSERT INTO role_permissions (role_id, permission_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
      `, [roleId, permId]);
    }
  }

};
