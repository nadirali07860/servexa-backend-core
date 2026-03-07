const redisClient = require('../../core/redis/redisClient');

const SEND_LIMIT = 3;
const SEND_WINDOW = 600; // 10 min in seconds

const VERIFY_LIMIT = 5;
const LOCK_TIME = 900; // 15 min in seconds

/* ================= SEND OTP SHIELD ================= */
exports.checkSendOtpLimit = async (phone) => {
  const key = `otp:send:${phone}`;

  const current = await redisClient.incr(key);

  if (current === 1) {
    await redisClient.expire(key, SEND_WINDOW);
  }

  if (current > SEND_LIMIT) {
    return false;
  }

  return true;
};

/* ================= VERIFY OTP SHIELD ================= */
exports.checkVerifyOtpLimit = async (phone) => {
  const lockKey = `otp:lock:${phone}`;
  const isLocked = await redisClient.get(lockKey);

  if (isLocked) {
    return { allowed: false, locked: true };
  }

  return { allowed: true };
};

exports.recordFailedAttempt = async (phone) => {
  const key = `otp:fail:${phone}`;

  const attempts = await redisClient.incr(key);

  if (attempts === 1) {
    await redisClient.expire(key, LOCK_TIME);
  }

  if (attempts >= VERIFY_LIMIT) {
    await redisClient.set(`otp:lock:${phone}`, 1, {
      EX: LOCK_TIME
    });
  }
};

exports.clearFailedAttempts = async (phone) => {
  await redisClient.del(`otp:fail:${phone}`);
  await redisClient.del(`otp:lock:${phone}`);
};
