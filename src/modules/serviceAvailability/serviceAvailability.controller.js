const service = require('./serviceAvailability.service');

async function addAvailability(req, res) {
  try {

    const data = await service.addAvailability(req.body);

    res.json({
      success: true,
      data
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
}

async function getSocietyServices(req, res) {

  const { society_id } = req.params;

  const services = await service.listSocietyServices(society_id);

  res.json({
    success: true,
    data: services
  });

}

module.exports = {
  addAvailability,
  getSocietyServices
};
