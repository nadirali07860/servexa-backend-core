exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token required"
      });
    }

    const decoded = verifyToken(refreshToken);

    const tokenCheck = await pool.query(
      `SELECT * FROM refresh_tokens WHERE token = $1`,
      [refreshToken]
    );

    // 🔥 Reuse detection
    if (tokenCheck.rows.length === 0) {
      // Possible token reuse attack → revoke all sessions
      await pool.query(
        `DELETE FROM refresh_tokens WHERE user_id = $1`,
        [decoded.id]
      );

      return res.status(403).json({
        success: false,
        message: "Session compromised. Please login again."
      });
    }

    // Rotation
    await pool.query(
      `DELETE FROM refresh_tokens WHERE token = $1`,
      [refreshToken]
    );

    const newAccessToken = generateAccessToken({ id: decoded.id });
    const newRefreshToken = generateRefreshToken({ id: decoded.id });

    await pool.query(
      `INSERT INTO refresh_tokens (user_id, token)
       VALUES ($1, $2)`,
      [decoded.id, newRefreshToken]
    );

    return res.json({
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });

  } catch (err) {
    return res.status(403).json({
      success: false,
      message: "Invalid or expired refresh token"
    });
  }
};
