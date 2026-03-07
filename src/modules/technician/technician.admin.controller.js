const pool = require('../../core/database');
const asyncHandler = require('../../shared/utils/asyncHandler');
const AppError = require('../../shared/utils/AppError');
const auditService = require('../../shared/services/audit.service');

exports.approveTechnician = asyncHandler(async (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    throw new AppError('user_id is required', 400);
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1️⃣ Lock user row
    const userResult = await client.query(
      `SELECT id, role_id, is_approved
       FROM users
       WHERE id = $1
       FOR UPDATE`,
      [user_id]
    );

    if (!userResult.rows.length) {
      throw new AppError('User not found', 404);
    }

    const user = userResult.rows[0];

    // 2️⃣ Ensure role is technician
    const roleCheck = await client.query(
      `SELECT r.name
       FROM roles r
       WHERE r.id = $1`,
      [user.role_id]
    );

    if (!roleCheck.rows.length || roleCheck.rows[0].name.toLowerCase() !== 'technician') {
      throw new AppError('User is not a technician', 400);
    }

    // 3️⃣ Update user approval
    await client.query(
      `UPDATE users
       SET is_approved = true,
           updated_at = NOW()
       WHERE id = $1`,
      [user_id]
    );

    // 4️⃣ Insert technician row if not exists
    await client.query(
      `
      INSERT INTO technicians (user_id, status, created_at)
      VALUES ($1, 'AVAILABLE', NOW())
      ON CONFLICT (user_id)
      DO UPDATE SET status = 'AVAILABLE'
      `,
      [user_id]
    );

    // 5️⃣ Audit log
    await auditService.log({
      action: 'TECHNICIAN_APPROVED',
      performed_by: req.user.id,
      entity_id: user_id,
      entity_type: 'USER'
    }, client);

    await client.query('COMMIT');

    res.json({
      success: true,
      message: 'Technician approved and provisioned successfully'
    });

  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
});
