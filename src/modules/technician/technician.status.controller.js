const pool = require('../../core/database');

async function goOnline(req, res) {

  const technicianId = req.user.id;

  await pool.query(
    `
    UPDATE technicians
    SET is_online=true,
        status='AVAILABLE'
    WHERE user_id=$1
    `,
    [technicianId]
  );

  return res.json({
    success: true,
    message: 'Technician is now ONLINE'
  });

}

async function goOffline(req, res) {

  const technicianId = req.user.id;

  await pool.query(
    `
    UPDATE technicians
    SET is_online=false,
        status='OFFLINE'
    WHERE user_id=$1
    `,
    [technicianId]
  );

  return res.json({
    success: true,
    message: 'Technician is now OFFLINE'
  });

}

module.exports = {
  goOnline,
  goOffline
};
