const pool = require('../../../core/database');
const asyncHandler = require('../../../shared/utils/asyncHandler');

/*
================= CUSTOMER HISTORY =================
*/
exports.customerHistory = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { page = 1, limit = 10, status } = req.query;

  const offset = (page - 1) * limit;

  let query = `
    SELECT *
    FROM bookings
    WHERE customer_id = $1
  `;

  const values = [userId];

  if (status) {
    query += ` AND status = $2`;
    values.push(status);
  }

  query += `
    ORDER BY created_at DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `;

  const result = await pool.query(query, values);

  res.json({
    success: true,
    page: Number(page),
    data: result.rows
  });
});

/*
================= TECHNICIAN HISTORY =================
*/
exports.technicianHistory = asyncHandler(async (req, res) => {
  const technicianId = req.user.id;
  const { page = 1, limit = 10, status } = req.query;

  const offset = (page - 1) * limit;

  let query = `
    SELECT *
    FROM bookings
    WHERE technician_id = $1
  `;

  const values = [technicianId];

  if (status) {
    query += ` AND status = $2`;
    values.push(status);
  }

  query += `
    ORDER BY created_at DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `;

  const result = await pool.query(query, values);

  res.json({
    success: true,
    page: Number(page),
    data: result.rows
  });
});
