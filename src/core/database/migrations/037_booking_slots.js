module.exports = {
  async up(pool) {

    await pool.query(`
      CREATE TABLE IF NOT EXISTS booking_slots (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

        technician_id UUID NOT NULL,

        slot_start TIMESTAMP NOT NULL,
        slot_end TIMESTAMP NOT NULL,

        is_booked BOOLEAN DEFAULT false,

        booking_id UUID,

        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_slots_technician
      ON booking_slots(technician_id);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_slots_time
      ON booking_slots(slot_start,slot_end);
    `);

  }
};
