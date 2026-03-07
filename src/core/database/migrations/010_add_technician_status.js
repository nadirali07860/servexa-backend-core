const pool = require('../index');

module.exports.up = async () => {
  await pool.query(`
    ALTER TABLE technicians
    ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'OFFLINE';
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_technician_status
    ON technicians(status);
  `);
};

module.exports.down = async () => {
  await pool.query(`
    ALTER TABLE technicians
    DROP COLUMN IF EXISTS status;
  `);
};
