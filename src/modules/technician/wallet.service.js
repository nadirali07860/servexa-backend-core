const AppError = require('../../shared/utils/AppError');

/*
=========================================================
  ENTERPRISE WALLET LEDGER ENGINE
=========================================================
*/

async function addTransaction(client, {
  user_id,
  booking_id = null,
  refund_id = null,
  type,        // CREDIT / DEBIT
  source,      // BOOKING_EARNING / REFUND_REVERSAL / WITHDRAW
  amount
}) {

  if (!['CREDIT', 'DEBIT'].includes(type))
    throw new AppError('Invalid transaction type', 400);

  if (Number(amount) <= 0)
    throw new AppError('Invalid amount', 400);

  await client.query(
    `
    INSERT INTO wallet_transactions
    (user_id, booking_id, refund_id, type, source, amount)
    VALUES ($1,$2,$3,$4,$5,$6)
    `,
    [user_id, booking_id, refund_id, type, source, amount]
  );

  // Recalculate balance from ledger (single source of truth)
  const balanceResult = await client.query(
    `
    SELECT
      COALESCE(
        SUM(
          CASE
            WHEN type='CREDIT' THEN amount
            WHEN type='DEBIT' THEN -amount
          END
        ),0
      ) as balance
    FROM wallet_transactions
    WHERE user_id=$1
    `,
    [user_id]
  );

  const newBalance = balanceResult.rows[0].balance;

  await client.query(
    `
    UPDATE wallets
    SET balance=$1, updated_at=NOW()
    WHERE user_id=$2
    `,
    [newBalance, user_id]
  );

  return newBalance;
}

module.exports = {
  addTransaction
};
