exports.up = async (pgm) => {
  await pgm.query(`
    CREATE TABLE IF NOT EXISTS wallet_holds (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
      amount NUMERIC(14,2) NOT NULL,
      release_at TIMESTAMP NOT NULL,
      released BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);

  await pgm.query(`
    CREATE INDEX IF NOT EXISTS idx_wallet_holds_user_id
    ON wallet_holds(user_id);
  `);

  await pgm.query(`
    CREATE INDEX IF NOT EXISTS idx_wallet_holds_release_at
    ON wallet_holds(release_at);
  `);
};

exports.down = async (pgm) => {
  await pgm.query(`
    DROP TABLE IF EXISTS wallet_holds;
  `);
};
