const pool = require('../index');

module.exports.up = async () => {

  // ================= CATEGORIES =================
  await pool.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(100) NOT NULL UNIQUE,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_category_active
    ON categories(is_active);
  `);

  // ================= SERVICES =================
  await pool.query(`
    CREATE TABLE IF NOT EXISTS services (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      category_id UUID REFERENCES categories(id) ON DELETE CASCADE,

      name VARCHAR(150) NOT NULL,
      description TEXT,

      base_price NUMERIC(12,2) NOT NULL,
      visit_charge NUMERIC(12,2) DEFAULT 0,

      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_service_category
    ON services(category_id);
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_service_active
    ON services(is_active);
  `);
};

module.exports.down = async () => {
  await pool.query(`DROP TABLE IF EXISTS services CASCADE`);
  await pool.query(`DROP TABLE IF EXISTS categories CASCADE`);
};
