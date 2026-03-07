module.exports = {
  async up(pool) {

    await pool.query(`
      CREATE TABLE IF NOT EXISTS service_availability (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

        service_id UUID NOT NULL,
        technician_id UUID NOT NULL,
        society_id UUID NOT NULL,

        is_active BOOLEAN DEFAULT true,

        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_service_availability_service
      ON service_availability(service_id);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_service_availability_society
      ON service_availability(society_id);
    `);

  }
};
