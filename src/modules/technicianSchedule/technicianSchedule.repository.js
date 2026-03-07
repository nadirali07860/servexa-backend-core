const db = require('../../core/database');

async function createSchedule(data) {

  const { technician_id, work_day, start_time, end_time } = data;

  const result = await db.query(
    `
    INSERT INTO technician_schedule
    (technician_id, work_day, start_time, end_time)
    VALUES ($1,$2,$3,$4)
    RETURNING *
    `,
    [technician_id, work_day, start_time, end_time]
  );

  return result.rows[0];

}

async function getTechnicianSchedule(technician_id) {

  const result = await db.query(
    `
    SELECT *
    FROM technician_schedule
    WHERE technician_id = $1
    AND is_active = true
    `,
    [technician_id]
  );

  return result.rows;

}

module.exports = {
  createSchedule,
  getTechnicianSchedule
};
