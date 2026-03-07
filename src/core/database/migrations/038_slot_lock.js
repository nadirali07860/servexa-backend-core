module.exports = {
  async up(pool){

    await pool.query(`
      CREATE TABLE IF NOT EXISTS slot_locks (

        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

        slot_id UUID NOT NULL,

        customer_id UUID NOT NULL,

        locked_until TIMESTAMP NOT NULL,

        created_at TIMESTAMP DEFAULT NOW()

      );
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_slot_lock
      ON slot_locks(slot_id);
    `);

  }
};
