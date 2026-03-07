module.exports = {
  up: async (client) => {

    await client.query(`
      CREATE TABLE IF NOT EXISTS ratings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
        customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        technician_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        review TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(booking_id)
      );
    `);

    await client.query(`
      ALTER TABLE technicians
      ADD COLUMN IF NOT EXISTS average_rating NUMERIC(3,2) DEFAULT 5.00;
    `);

    await client.query(`
      ALTER TABLE technicians
      ADD COLUMN IF NOT EXISTS total_ratings INTEGER DEFAULT 0;
    `);
  },

  down: async (client) => {
    await client.query(`DROP TABLE IF EXISTS ratings;`);

    await client.query(`
      ALTER TABLE technicians
      DROP COLUMN IF EXISTS average_rating;
    `);

    await client.query(`
      ALTER TABLE technicians
      DROP COLUMN IF EXISTS total_ratings;
    `);
  }
};
