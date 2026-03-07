const crypto = require('crypto');
const pool = require('../../core/database');
const redis = require('../../core/redis');

const OTP_EXPIRY_MINUTES = 5;
const MAX_ATTEMPTS = 5;
const LOCK_TIME_MINUTES = 15;

const PHONE_OTP_LIMIT = 3;          // 3 OTP
const PHONE_OTP_WINDOW = 600;       // 10 minutes

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function hashOtp(otp) {
  return crypto.createHash('sha256').update(otp).digest('hex');
}

function generateExpiryTime() {
  const now = new Date();
  now.setMinutes(now.getMinutes() + OTP_EXPIRY_MINUTES);
  return now;
}

/* ---------------- SEND OTP ---------------- */

async function sendOtp(phone) {

  const redisKey = `otp:phone:${phone}`;
  const currentCount = await redis.get(redisKey);

  if (currentCount && parseInt(currentCount) >= PHONE_OTP_LIMIT) {
    throw new Error('Too many OTP requests. Please try again later.');
  }

  const otp = generateOtp();
  const hashedOtp = hashOtp(otp);
  const expiresAt = generateExpiryTime();

  await pool.query(
    `INSERT INTO otp_logs (phone, otp, expires_at)
     VALUES ($1, $2, $3)`,
    [phone, hashedOtp, expiresAt]
  );

  // increment counter
  const newCount = await redis.incr(redisKey);

  if (newCount === 1) {
    await redis.expire(redisKey, PHONE_OTP_WINDOW);
  }

  return { phone, otp };
}

/* ---------------- VERIFY OTP ---------------- */

async function verifyOtp(phone, otp) {

  const hashedOtp = hashOtp(otp);

  const result = await pool.query(
    `SELECT * FROM otp_logs
     WHERE phone = $1
     ORDER BY created_at DESC
     LIMIT 1`,
    [phone]
  );

  if (result.rows.length === 0) {
    throw new Error('OTP not found');
  }

  const otpRecord = result.rows[0];

  if (otpRecord.locked_until && new Date() < otpRecord.locked_until) {
    throw new Error('Too many attempts. Locked for 15 minutes.');
  }

  if (new Date() > otpRecord.expires_at) {
    throw new Error('OTP expired');
  }

  if (otpRecord.otp !== hashedOtp) {

    const attempts = otpRecord.attempts + 1;

    if (attempts >= MAX_ATTEMPTS) {

      const lockUntil = new Date();
      lockUntil.setMinutes(lockUntil.getMinutes() + LOCK_TIME_MINUTES);

      await pool.query(
        `UPDATE otp_logs
         SET attempts = $1,
             locked_until = $2
         WHERE id = $3`,
        [attempts, lockUntil, otpRecord.id]
      );

      throw new Error('Too many attempts. Locked for 15 minutes.');
    }

    await pool.query(
      `UPDATE otp_logs
       SET attempts = $1
       WHERE id = $2`,
      [attempts, otpRecord.id]
    );

    throw new Error('Invalid OTP');
  }

  await pool.query(
    `UPDATE otp_logs
     SET verified = true
     WHERE id = $1`,
    [otpRecord.id]
  );

  return { success: true };
}

module.exports = { sendOtp, verifyOtp };
