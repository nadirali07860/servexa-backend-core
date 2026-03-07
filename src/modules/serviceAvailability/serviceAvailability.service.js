const repo = require('./serviceAvailability.repository');

async function addAvailability(data) {
  return repo.createAvailability(data);
}

async function listSocietyServices(society_id) {
  return repo.getAvailableServices(society_id);
}

module.exports = {
  addAvailability,
  listSocietyServices
};
