exports.up = async (db) => {

  await db.query(`
    ALTER TABLE technicians
    ADD COLUMN IF NOT EXISTS is_online BOOLEAN DEFAULT false
  `);

};

exports.down = async (db) => {

  await db.query(`
    ALTER TABLE technicians
    DROP COLUMN IF EXISTS is_online
  `);

};
