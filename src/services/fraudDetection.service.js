const pool = require('../core/database');
const { getSetting } = require('../core/config/settings.service');

async function runFraudDetection(){

  const enabled = await getSetting('fraud_detection_enabled');

  if(!enabled){
    return;
  }

  const bookingLimit =
    Number(await getSetting('fraud_booking_limit_per_hour')) || 5;

  const refundLimit =
    Number(await getSetting('fraud_refund_limit_per_day')) || 3;

  const technicianLimit =
    Number(await getSetting('fraud_same_technician_limit')) || 4;

  const excessiveBookings = await pool.query(
    `
    SELECT customer_id, COUNT(*) as bookings
    FROM bookings
    WHERE created_at > NOW() - INTERVAL '1 hour'
    GROUP BY customer_id
    HAVING COUNT(*) > $1
    `,
    [bookingLimit]
  );

  for(const row of excessiveBookings.rows){
    console.warn(
      "⚠ Fraud Alert: excessive bookings",
      "customer", row.customer_id,
      "count", row.bookings
    );
  }

  const refundAbuse = await pool.query(
    `
    SELECT user_id, COUNT(*) as refunds
    FROM refunds
    WHERE created_at > NOW() - INTERVAL '1 day'
    GROUP BY user_id
    HAVING COUNT(*) > $1
    `,
    [refundLimit]
  );

  for(const row of refundAbuse.rows){
    console.warn(
      "⚠ Fraud Alert: refund abuse",
      "user", row.user_id,
      "count", row.refunds
    );
  }

  const collusion = await pool.query(
    `
    SELECT customer_id, technician_id, COUNT(*) as bookings
    FROM bookings
    WHERE created_at > NOW() - INTERVAL '1 day'
    GROUP BY customer_id, technician_id
    HAVING COUNT(*) > $1
    `,
    [technicianLimit]
  );

  for(const row of collusion.rows){
    console.warn(
      "⚠ Fraud Alert: collusion",
      "customer", row.customer_id,
      "technician", row.technician_id,
      "count", row.bookings
    );
  }

}

module.exports = { runFraudDetection };
