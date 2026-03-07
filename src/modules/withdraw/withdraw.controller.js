const pool = require('../../core/database');
const asyncHandler = require('../../shared/utils/asyncHandler');
const AppError = require('../../shared/utils/AppError');
const { logAction } = require('../../shared/services/audit.service');

/*
================= REQUEST WITHDRAW =================
*/
exports.requestWithdraw = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    throw new AppError("Invalid withdraw amount", 400);
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const walletResult = await client.query(
      `SELECT balance FROM wallets WHERE user_id = $1 FOR UPDATE`,
      [userId]
    );

    if (!walletResult.rows.length) {
      throw new AppError("Wallet not found", 404);
    }

    const balance = Number(walletResult.rows[0].balance);

    if (balance < amount) {
      throw new AppError("Insufficient balance", 400);
    }

    const existingPending = await client.query(
      `SELECT id FROM withdraw_requests
       WHERE user_id = $1 AND status = 'PENDING'`,
      [userId]
    );

    if (existingPending.rows.length) {
      throw new AppError("You already have a pending withdraw request", 400);
    }

    const withdrawResult = await client.query(
      `INSERT INTO withdraw_requests (user_id, amount)
       VALUES ($1, $2)
       RETURNING *`,
      [userId, amount]
    );

    await logAction({
      userId,
      role: req.user.role,
      module: "WITHDRAW",
      action: "WITHDRAW_REQUESTED",
      entityId: withdrawResult.rows[0].id,
      newValue: { amount },
      ipAddress: req.ip
    });

    await client.query('COMMIT');

    res.json({
      success: true,
      message: "Withdraw request submitted",
      data: withdrawResult.rows[0]
    });

  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
});

/*
================= ADMIN APPROVE =================
*/
exports.approveWithdraw = asyncHandler(async (req, res) => {
  const adminId = req.user.id;
  const { withdraw_id } = req.body;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const withdrawResult = await client.query(
      `SELECT * FROM withdraw_requests
       WHERE id = $1 AND status = 'PENDING'
       FOR UPDATE`,
      [withdraw_id]
    );

    if (!withdrawResult.rows.length) {
      throw new AppError("Invalid withdraw request", 400);
    }

    const withdraw = withdrawResult.rows[0];

    const walletResult = await client.query(
      `SELECT balance FROM wallets
       WHERE user_id = $1
       FOR UPDATE`,
      [withdraw.user_id]
    );

    if (!walletResult.rows.length) {
      throw new AppError("Wallet not found", 404);
    }

    const balance = Number(walletResult.rows[0].balance);

    if (balance < withdraw.amount) {
      throw new AppError("Insufficient balance at approval time", 400);
    }

    await client.query(
      `UPDATE wallets
       SET balance = balance - $1
       WHERE user_id = $2`,
      [withdraw.amount, withdraw.user_id]
    );

    await client.query(
      `INSERT INTO wallet_transactions (user_id, amount, type)
       VALUES ($1, $2, 'DEBIT')`,
      [withdraw.user_id, withdraw.amount]
    );

    await client.query(
      `UPDATE withdraw_requests
       SET status = 'APPROVED',
           processed_at = NOW(),
           processed_by = $1
       WHERE id = $2`,
      [adminId, withdraw_id]
    );

    await logAction({
      userId: adminId,
      role: req.user.role,
      module: "WITHDRAW",
      action: "WITHDRAW_APPROVED",
      entityId: withdraw_id,
      ipAddress: req.ip
    });

    await client.query('COMMIT');

    res.json({
      success: true,
      message: "Withdraw approved successfully"
    });

  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
});

/*
================= ADMIN REJECT =================
*/
exports.rejectWithdraw = asyncHandler(async (req, res) => {
  const adminId = req.user.id;
  const { withdraw_id, remarks } = req.body;

  const result = await pool.query(
    `UPDATE withdraw_requests
     SET status = 'REJECTED',
         processed_at = NOW(),
         processed_by = $1,
         remarks = $2
     WHERE id = $3 AND status = 'PENDING'
     RETURNING *`,
    [adminId, remarks || null, withdraw_id]
  );

  if (!result.rows.length) {
    throw new AppError("Invalid withdraw request", 400);
  }

  await logAction({
    userId: adminId,
    role: req.user.role,
    module: "WITHDRAW",
    action: "WITHDRAW_REJECTED",
    entityId: withdraw_id,
    ipAddress: req.ip
  });

  res.json({
    success: true,
    message: "Withdraw rejected"
  });
});
