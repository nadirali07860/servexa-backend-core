const pool = require('../core/database');

async function updateTechnicianLocation(technicianId, lat, lng) {

  await pool.query(
    `
    INSERT INTO technician_locations (technician_id, latitude, longitude)
    VALUES ($1,$2,$3)
    ON CONFLICT (technician_id)
    DO UPDATE SET
      latitude = EXCLUDED.latitude,
      longitude = EXCLUDED.longitude,
      updated_at = NOW()
    `,
    [technicianId, lat, lng]
  );

}

module.exports = {
  updateTechnicianLocation
};
