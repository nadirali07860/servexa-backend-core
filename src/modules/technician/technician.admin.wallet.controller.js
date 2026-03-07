const pool = require('../../core/database');

exports.approveWithdraw = async (req, res) => {
  try {
    const { withdraw_id } = req.body;

    const request = await pool.query(
      `SELECT * FROM withdraw_requests WHERE id = $1`,
      [withdraw_id]
    );

    if (!request.rows.length)
      return res.status(404).json({ success:false, message:"Request not found" });

    const withdraw = request.rows[0];

    if (withdraw.status !== 'PENDING')
      return res.status(400).json({ success:false, message:"Already processed" });

    const wallet = await pool.query(
      `SELECT balance FROM wallets WHERE user_id = $1`,
      [withdraw.user_id]
    );

    if (!wallet.rows.length || wallet.rows[0].balance < withdraw.amount)
      return res.status(400).json({ success:false, message:"Insufficient balance" });

    // Deduct balance
    await pool.query(
      `UPDATE wallets
       SET balance = balance - $1
       WHERE user_id = $2`,
      [withdraw.amount, withdraw.user_id]
    );

    // Update withdraw status
    await pool.query(
      `UPDATE withdraw_requests
       SET status = 'APPROVED'
       WHERE id = $1`,
      [withdraw_id]
    );

    // Log transaction
    await pool.query(
      `INSERT INTO wallet_transactions (user_id, amount, type)
       VALUES ($1, $2, 'DEBIT')`,
      [withdraw.user_id, withdraw.amount]
    );

    res.json({ success:true, message:"Withdraw approved & balance deducted" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success:false, message:"Approval failed" });
  }
};
