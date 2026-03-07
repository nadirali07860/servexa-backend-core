const pool = require('../core/database');

async function findBestTechnician(serviceId, societyId, lat, lng) {

  const result = await pool.query(
    `
    SELECT
      t.id,
      t.rating,
      t.completed_jobs,
      l.latitude,
      l.longitude,
      (
        6371 *
        acos(
          cos(radians($3)) *
          cos(radians(l.latitude)) *
          cos(radians(l.longitude) - radians($4)) +
          sin(radians($3)) *
          sin(radians(l.latitude))
        )
      ) AS distance
    FROM technicians t
    JOIN technician_locations l
      ON t.id = l.technician_id
    WHERE
      t.is_online = true
      AND t.is_approved = true
      AND t.service_id = $1
      AND t.society_id = $2
    ORDER BY
      distance ASC,
      t.rating DESC,
      t.completed_jobs DESC
    LIMIT 1
    `,
    [serviceId, societyId, lat, lng]
  );

  return result.rows[0];

}

module.exports = {
  findBestTechnician
};
