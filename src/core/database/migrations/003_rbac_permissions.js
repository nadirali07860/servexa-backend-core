module.exports.up = async function (pool) {

  /* ================= PERMISSIONS ================= */

  await pool.query(`
    CREATE TABLE IF NOT EXISTS permissions (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(150) NOT NULL UNIQUE,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  /* ================= ROLE PERMISSIONS ================= */

  await pool.query(`
    CREATE TABLE IF NOT EXISTS role_permissions (
      role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
      permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
      PRIMARY KEY (role_id, permission_id)
    );
  `);

  /* ================= INDEXES ================= */

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_role_permissions_role
    ON role_permissions(role_id);
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_role_permissions_permission
    ON role_permissions(permission_id);
  `);

};
