const withTransaction = require('../../core/database/withTransaction');
const AppError = require('../../shared/utils/AppError');

/* =========================================================
   REQUEST REFUND (Customer)
========================================================= */
async function requestRefund(user, booking_id, reason) {

  return withTransaction(async (client) => {

    const bookingResult = await client.query(
      `SELECT * FROM bookings
       WHERE id=$1 AND customer_id=$2 AND status='COMPLETED'
       FOR UPDATE`,
      [booking_id, user.id]
    );

    if (!bookingResult.rows.length)
      throw new AppError("Booking not eligible for refund", 400);

    const booking = bookingResult.rows[0];

    if (!booking.guarantee_expiry_at || new Date() > booking.guarantee_expiry_at)
      throw new AppError("Guarantee period expired", 400);

    const existing = await client.query(
      `SELECT id FROM refunds WHERE booking_id=$1`,
      [booking_id]
    );

    if (existing.rows.length)
      throw new AppError("Refund already requested", 400);

    const insert = await client.query(
      `
      INSERT INTO refunds
      (booking_id, customer_id, technician_id, amount, reason)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *
      `,
      [
        booking_id,
        user.id,
        booking.technician_id,
        booking.base_price_snapshot + booking.visit_charge_snapshot,
        reason
      ]
    );

    return { success: true, data: insert.rows[0] };
  });
}

/* =========================================================
   APPROVE REFUND (Admin)
========================================================= */
async function approveRefund(refund_id) {

  return withTransaction(async (client) => {

    const result = await client.query(
      `SELECT r.*, b.technician_earning
       FROM refunds r
       JOIN bookings b ON b.id = r.booking_id
       WHERE r.id=$1 AND r.status='REQUESTED'
       FOR UPDATE`,
      [refund_id]
    );

    if (!result.rows.length)
      throw new AppError("Invalid refund", 400);

    const refund = result.rows[0];

    // Deduct technician earning
    const walletResult = await client.query(
      `SELECT balance FROM wallets
       WHERE user_id=$1
       FOR UPDATE`,
      [refund.technician_id]
    );

    let remaining = Number(walletResult.rows[0].balance) - Number(refund.technician_earning);

    if (remaining >= 0) {
      await client.query(
        `UPDATE wallets
         SET balance=$1, updated_at=NOW()
         WHERE user_id=$2`,
        [remaining, refund.technician_id]
      );
    } else {
      // Deduct security fallback
      await client.query(
        `UPDATE technicians
         SET security_deposit = security_deposit + $1
         WHERE user_id=$2`,
        [remaining, refund.technician_id]
      );

      await client.query(
        `UPDATE wallets
         SET balance=0, updated_at=NOW()
         WHERE user_id=$1`,
        [refund.technician_id]
      );
    }

    await client.query(
      `UPDATE refunds
       SET status='APPROVED', updated_at=NOW()
       WHERE id=$1`,
      [refund_id]
    );

    return { success: true };
  });
}

/* =========================================================
   REJECT REFUND (Admin)
========================================================= */
async function rejectRefund(refund_id) {

  return withTransaction(async (client) => {

    const result = await client.query(
      `UPDATE refunds
       SET status='REJECTED', updated_at=NOW()
       WHERE id=$1 AND status='REQUESTED'
       RETURNING id`,
      [refund_id]
    );

    if (!result.rows.length)
      throw new AppError("Refund not found", 400);

    return { success: true };
  });
}

module.exports = {
  requestRefund,
  approveRefund,
  rejectRefund
};
