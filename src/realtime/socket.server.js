const { Server } = require("socket.io");

let io;

function initSocket(server) {

  io = new Server(server, {
    cors: {
      origin: "*"
    }
  });

  io.on("connection", (socket) => {

    console.log("Socket connected:", socket.id);

    /*
    ================================
    TECHNICIAN JOIN
    ================================
    */

    socket.on("technician:join", (technicianId) => {

      socket.join("tech_" + technicianId);

      console.log("Technician joined:", technicianId);

    });


    /*
    ================================
    CUSTOMER JOIN
    ================================
    */

    socket.on("customer:join", (customerId) => {

      socket.join("customer_" + customerId);

      console.log("Customer joined:", customerId);

    });


    /*
    ================================
    BOOKING ROOM JOIN
    ================================
    */

    socket.on("join_booking_room", (bookingId) => {

      socket.join("booking_" + bookingId);

      console.log("Booking room joined:", bookingId);

    });


    /*
    ================================
    TECHNICIAN LIVE LOCATION
    ================================
    */

    socket.on("technician_location", (data) => {

      const {
        technicianId,
        bookingId,
        latitude,
        longitude
      } = data;

      console.log("Location update:", technicianId);

      io.to("booking_" + bookingId).emit(
        "technician_location_update",
        {
          technicianId,
          latitude,
          longitude
        }
      );

    });


    /*
    ================================
    DISCONNECT
    ================================
    */

    socket.on("disconnect", () => {

      console.log("Socket disconnected:", socket.id);

    });

  });

  console.log("Realtime socket engine started");

}

function getIO() {

  if (!io) {

    throw new Error("Socket not initialized");

  }

  return io;

}

module.exports = {
  initSocket,
  getIO
};
