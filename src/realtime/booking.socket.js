const { getIO } = require("./socket.server");

function notifyTechnician(technicianId, booking) {

  const io = getIO();

  io.to("tech-" + technicianId).emit("new-booking", {
    booking
  });

}

function notifyCustomer(customerId, status) {

  const io = getIO();

  io.to("customer-" + customerId).emit("booking-status", {
    status
  });

}

module.exports = {
  notifyTechnician,
  notifyCustomer
};
