const pool = require('../../core/database');

async function updateLocation(req, res) {

  const technicianId = req.user.id;
  const { latitude, longitude } = req.body;

  try {

    await pool.query(`
      INSERT INTO technician_locations
      (technician_id, latitude, longitude)
      VALUES ($1,$2,$3)
      ON CONFLICT (technician_id)
      DO UPDATE SET
      latitude = $2,
      longitude = $3,
      updated_at = NOW()
    `,[technicianId, latitude, longitude]);

    res.json({
      success:true,
      message:"Location updated"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success:false,
      message:"Location update failed"
    });

  }

}

module.exports = { updateLocation };
