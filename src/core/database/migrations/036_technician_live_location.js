module.exports = {

  up: async (db) => {

    await db.query(`
      CREATE TABLE IF NOT EXISTS technician_locations (
        technician_id UUID PRIMARY KEY
        REFERENCES technicians(user_id)
        ON DELETE CASCADE,

        latitude DECIMAL(10,8) NOT NULL,
        longitude DECIMAL(11,8) NOT NULL,

        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

  },

  down: async (db) => {

    await db.query(`
      DROP TABLE IF EXISTS technician_locations;
    `);

  }

};
