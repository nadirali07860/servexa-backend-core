module.exports = {
  async up(pool) {

    await pool.query(`
      CREATE TABLE IF NOT EXISTS technician_schedule (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

        technician_id UUID NOT NULL,

        work_day VARCHAR(20) NOT NULL,

        start_time TIME NOT NULL,
        end_time TIME NOT NULL,

        is_active BOOLEAN DEFAULT true,

        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_technician_schedule_tech
      ON technician_schedule(technician_id);
    `);

  }
};
