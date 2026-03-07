const pool = require('../../core/database');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

/* =========================================================
   SEND OTP
========================================================= */
exports.sendOtp = async (req, res, next) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      throw new Error('Phone is required');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await pool.query(
      `INSERT INTO otp_logs (phone, otp, expires_at)
       VALUES ($1, $2, $3)`,
      [phone, otp, expiresAt]
    );

    res.json({
      success: true,
      message: 'OTP sent successfully',
      data: { phone, otp } // ⚠ remove OTP in production
    });

  } catch (error) {
    next(error);
  }
};


/* =========================================================
   VERIFY OTP (STRICT ROLE + TECH APPROVAL)
========================================================= */
exports.verifyOtp = async (req, res, next) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { phone, otp, name, role } = req.body;

    if (!phone || !otp || !role) {
      throw new Error('Phone, OTP and role are required');
    }

    /* ===== GET LATEST OTP ===== */
    const otpResult = await client.query(
      `SELECT * FROM otp_logs
       WHERE phone = $1
       ORDER BY created_at DESC
       LIMIT 1`,
      [phone]
    );

    if (!otpResult.rows.length) {
      throw new Error('OTP not found');
    }

    const otpRow = otpResult.rows[0];

    if (otpRow.otp !== otp) {
      throw new Error('Invalid OTP');
    }

    if (new Date() > new Date(otpRow.expires_at)) {
      throw new Error('OTP expired');
    }

    /* ===== GET ROLE ===== */
    const roleResult = await client.query(
      `SELECT id, name FROM roles WHERE name = $1 LIMIT 1`,
      [role]
    );

    if (!roleResult.rows.length) {
      throw new Error('Invalid role');
    }

    const roleData = roleResult.rows[0];

    /* ===== CHECK USER ===== */
    const userResult = await client.query(
      `SELECT u.*, r.name AS role_name
       FROM users u
       LEFT JOIN roles r ON u.role_id = r.id
       WHERE u.phone = $1`,
      [phone]
    );

    let user;

    /* =====================================================
       CREATE NEW USER
    ===================================================== */
    if (!userResult.rows.length) {

      const isApproved =
        roleData.name === 'technician' ? false : true;

      const newUser = await client.query(
        `INSERT INTO users
         (id, phone, full_name, role_id, is_approved)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [
          uuidv4(),
          phone,
          name || null,
          roleData.id,
          isApproved
        ]
      );

      user = {
        ...newUser.rows[0],
        role_name: roleData.name
      };

    } else {

      /* =====================================================
         STRICT ROLE MODE
      ===================================================== */
      const existingUser = userResult.rows[0];

      if (existingUser.role_name !== roleData.name) {
        throw new Error(
          `Role mismatch. This phone is registered as ${existingUser.role_name}`
        );
      }

      /* ===== TECHNICIAN APPROVAL CHECK ===== */
      if (
        roleData.name === 'technician' &&
        !existingUser.is_approved
      ) {
        throw new Error('Technician not approved by admin yet');
      }

      user = existingUser;
    }

    /* ===== GENERATE TOKENS ===== */
    const accessToken = jwt.sign(
      { id: user.id, role: user.role_name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
    );

    await client.query('COMMIT');

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user,
        accessToken,
        refreshToken
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
};
