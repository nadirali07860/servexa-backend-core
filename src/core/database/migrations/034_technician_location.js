module.exports = {
  async up(pool) {

    await pool.query(`
      CREATE TABLE IF NOT EXISTS technician_locations (
        technician_id UUID PRIMARY KEY,
        latitude DOUBLE PRECISION NOT NULL,
        longitude DOUBLE PRECISION NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_technician_location
      ON technician_locations(technician_id);
    `);

  }
};
