exports.up = async (pool) => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS service_societies (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

      service_id UUID NOT NULL
        REFERENCES services(id)
        ON DELETE CASCADE,

      society_id UUID NOT NULL
        REFERENCES societies(id)
        ON DELETE CASCADE,

      is_active BOOLEAN NOT NULL DEFAULT TRUE,

      created_at TIMESTAMP NOT NULL DEFAULT NOW(),

      CONSTRAINT unique_service_society UNIQUE(service_id, society_id)
    );
  `);

  await pool.query(`CREATE INDEX IF NOT EXISTS idx_service_societies_service_id ON service_societies(service_id);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_service_societies_society_id ON service_societies(society_id);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_service_societies_is_active ON service_societies(is_active);`);
};

exports.down = async (pool) => {
  await pool.query(`DROP TABLE IF EXISTS service_societies;`);
};
