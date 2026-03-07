const AppError = require('../../shared/utils/AppError');

const STRIKE_THRESHOLD = 3;

async function applyRefundStrike(client, technicianId) {

  const techRes = await client.query(
    `SELECT refund_strikes, status
     FROM technicians
     WHERE user_id=$1
     FOR UPDATE`,
    [technicianId]
  );

  if (!techRes.rows.length) {
    throw new AppError('Technician not found', 404);
  }

  const technician = techRes.rows[0];
  const newStrikeCount = technician.refund_strikes + 1;

  await client.query(
    `UPDATE technicians
     SET refund_strikes=$1,
         updated_at=NOW()
     WHERE user_id=$2`,
    [newStrikeCount, technicianId]
  );

  if (newStrikeCount >= STRIKE_THRESHOLD) {

    await client.query(
      `UPDATE technicians
       SET status='SUSPENDED',
           suspended_at=NOW(),
           suspension_reason='AUTO_REFUND_STRIKE_LIMIT',
           updated_at=NOW()
       WHERE user_id=$1`,
      [technicianId]
    );

    return { strikes: newStrikeCount, suspended: true };
  }

  return { strikes: newStrikeCount, suspended: false };
}

module.exports = {
  applyRefundStrike
};
