const withTransaction = require('../../core/database/withTransaction');
const AppError = require('../../shared/utils/AppError');
const walletService = require('../technician/wallet.service');

/*
========================================================
CREATE WITHDRAW REQUEST (ESCROW SAFE)
========================================================
*/

async function createWithdrawRequest(userId, amount) {
  return withTransaction(async (client) => {

    if (!amount || Number(amount) <= 0) {
      throw new AppError('Invalid withdraw amount', 400);
    }

    const walletResult = await client.query(
      `SELECT balance FROM wallets WHERE user_id=$1 FOR UPDATE`,
      [userId]
    );

    if (!walletResult.rows.length) {
      throw new AppError('Wallet not found', 404);
    }

    const balance = Number(walletResult.rows[0].balance);

    // Calculate locked amount
    const holdResult = await client.query(
      `SELECT COALESCE(SUM(amount),0) AS locked
       FROM wallet_holds
       WHERE user_id=$1
       AND released=false`,
      [userId]
    );

    const lockedAmount = Number(holdResult.rows[0].locked);
    const availableBalance = balance - lockedAmount;

    if (availableBalance <= 0) {
      throw new AppError('No withdrawable balance available', 400);
    }

    if (Number(amount) > availableBalance) {
      throw new AppError('Amount exceeds withdrawable balance', 400);
    }

    // Debit wallet
    await walletService.addTransaction(client, {
      user_id: userId,
      booking_id: null,
      type: 'DEBIT',
      source: 'WITHDRAW_REQUEST',
      amount: amount
    });

    const insert = await client.query(
      `INSERT INTO withdraw_requests
       (user_id, amount, status, created_at)
       VALUES ($1,$2,'PENDING',NOW())
       RETURNING *`,
      [userId, amount]
    );

    return { success: true, data: insert.rows[0] };
  });
}

module.exports = {
  createWithdrawRequest
};
