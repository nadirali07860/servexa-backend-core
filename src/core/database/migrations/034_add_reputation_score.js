exports.up = async (pool) => {

  await pool.query(`
    ALTER TABLE technicians
    ADD COLUMN IF NOT EXISTS reputation_score NUMERIC DEFAULT 100
  `);

};

exports.down = async (pool) => {

  await pool.query(`
    ALTER TABLE technicians
    DROP COLUMN IF EXISTS reputation_score
  `);

};
