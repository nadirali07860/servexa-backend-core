const pool = require('../index');

module.exports.up = async () => {

  /* ================= FINANCIAL NOT NULL ================= */

  await pool.query(`
    ALTER TABLE bookings
    ALTER COLUMN base_price_snapshot SET DEFAULT 0,
    ALTER COLUMN visit_charge_snapshot SET DEFAULT 0,
    ALTER COLUMN commission_percent_snapshot SET DEFAULT 0,
    ALTER COLUMN commission_amount SET DEFAULT 0,
    ALTER COLUMN technician_earning SET DEFAULT 0;
  `);

  await pool.query(`
    UPDATE bookings SET
      base_price_snapshot = COALESCE(base_price_snapshot, 0),
      visit_charge_snapshot = COALESCE(visit_charge_snapshot, 0),
      commission_percent_snapshot = COALESCE(commission_percent_snapshot, 0),
      commission_amount = COALESCE(commission_amount, 0),
      technician_earning = COALESCE(technician_earning, 0);
  `);

  await pool.query(`
    ALTER TABLE bookings
    ALTER COLUMN base_price_snapshot SET NOT NULL,
    ALTER COLUMN visit_charge_snapshot SET NOT NULL,
    ALTER COLUMN commission_percent_snapshot SET NOT NULL,
    ALTER COLUMN commission_amount SET NOT NULL,
    ALTER COLUMN technician_earning SET NOT NULL;
  `);

  /* ================= CHECK CONSTRAINTS ================= */

  await pool.query(`
    ALTER TABLE bookings
    ADD CONSTRAINT check_commission_percent
    CHECK (commission_percent_snapshot >= 0 AND commission_percent_snapshot <= 100);
  `);

  await pool.query(`
    ALTER TABLE bookings
    ADD CONSTRAINT check_positive_amounts
    CHECK (
      base_price_snapshot >= 0 AND
      visit_charge_snapshot >= 0 AND
      commission_amount >= 0 AND
      technician_earning >= 0
    );
  `);

  /* ================= WALLET HARDENING ================= */

  await pool.query(`
    ALTER TABLE wallets
    ALTER COLUMN balance SET DEFAULT 0,
    ALTER COLUMN balance SET NOT NULL;
  `);

  await pool.query(`
    ALTER TABLE wallets
    ADD CONSTRAINT check_wallet_balance_non_negative
    CHECK (balance >= 0);
  `);

  await pool.query(`
    UPDATE wallet_transactions
    SET amount = COALESCE(amount, 0);
  `);

  await pool.query(`
    ALTER TABLE wallet_transactions
    ALTER COLUMN amount SET NOT NULL;
  `);

  await pool.query(`
    ALTER TABLE wallet_transactions
    ADD CONSTRAINT check_wallet_tx_amount_positive
    CHECK (amount >= 0);
  `);

  /* ================= BOOKING STATUS ENUM CHECK ================= */

  await pool.query(`
    ALTER TABLE bookings
    ADD CONSTRAINT check_booking_status
    CHECK (status IN ('CREATED','ASSIGNED','ACCEPTED','IN_PROGRESS','COMPLETED','CANCELLED','REJECTED'));
  `);

};

module.exports.down = async () => {
  console.log('Enterprise financial hardening cannot be safely rolled back.');
};
