const pool = require('../../core/database');

exports.getWallet = async (req, res) => {
  try {
    const userId = req.user.id;

    const wallet = await pool.query(
      `SELECT balance FROM wallets WHERE user_id = $1`,
      [userId]
    );

    const transactions = await pool.query(
      `SELECT amount, type, created_at
       FROM wallet_transactions
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      balance: wallet.rows[0]?.balance || 0,
      transactions: transactions.rows
    });

  } catch {
    res.status(500).json({ success: false, message: "Failed to fetch wallet" });
  }
};

exports.requestWithdraw = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount } = req.body;

    const wallet = await pool.query(
      `SELECT balance FROM wallets WHERE user_id = $1`,
      [userId]
    );

    if (!wallet.rows.length || wallet.rows[0].balance < amount)
      return res.status(400).json({ success: false, message: "Insufficient balance" });

    await pool.query(
      `INSERT INTO withdraw_requests (user_id, amount)
       VALUES ($1, $2)`,
      [userId, amount]
    );

    res.json({ success: true, message: "Withdraw request submitted" });

  } catch {
    res.status(500).json({ success: false, message: "Withdraw failed" });
  }
};
