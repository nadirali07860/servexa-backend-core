
exports.up = async (pgm) => {

  await pgm.query(`
    ALTER TABLE technicians
    ADD COLUMN IF NOT EXISTS refund_strikes INTEGER NOT NULL DEFAULT 0;
  `);

  await pgm.query(`
    ALTER TABLE technicians
    ADD COLUMN IF NOT EXISTS suspended_at TIMESTAMP;
  `);

  await pgm.query(`
    ALTER TABLE technicians
    ADD COLUMN IF NOT EXISTS suspension_reason TEXT;
  `);

};

exports.down = async (pgm) => {

  await pgm.query(`
    ALTER TABLE technicians
    DROP COLUMN IF EXISTS refund_strikes;
  `);

  await pgm.query(`
    ALTER TABLE technicians
    DROP COLUMN IF EXISTS suspended_at;
  `);

  await pgm.query(`
    ALTER TABLE technicians
    DROP COLUMN IF EXISTS suspension_reason;
  `);

};

