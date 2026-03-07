const db = require('../../core/database');

async function createAvailability(data) {

  const { service_id, technician_id, society_id } = data;

  const result = await db.query(
    `
    INSERT INTO service_availability
    (service_id, technician_id, society_id)
    VALUES ($1,$2,$3)
    RETURNING *
    `,
    [service_id, technician_id, society_id]
  );

  return result.rows[0];

}

async function getAvailableServices(society_id) {

  const result = await db.query(
    `
    SELECT *
    FROM service_availability
    WHERE society_id = $1
    AND is_active = true
    `,
    [society_id]
  );

  return result.rows;

}

module.exports = {
  createAvailability,
  getAvailableServices
};
