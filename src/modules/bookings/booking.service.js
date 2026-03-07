const pool = require('../../core/database');
const { smartDispatch } = require('./booking.smartDispatch.service');

async function createBooking(user, body) {

const { service_id, society_id, latitude, longitude } = body;

const technicianId = await smartDispatch(
service_id,
society_id,
latitude,
longitude
);

const bookingResult = await pool.query(
`
INSERT INTO bookings
(customer_id, service_id, society_id, technician_id, status)
VALUES ($1,$2,$3,$4,'ASSIGNED')
RETURNING *
`,
[user.id, service_id, society_id, technicianId]
);

if (technicianId) {

await pool.query(
`
UPDATE technicians
SET active_bookings = active_bookings + 1
WHERE user_id = $1
`,
[technicianId]
);

}

return bookingResult.rows[0];

}

async function acceptBooking(bookingId, userId) {

await pool.query(
`
UPDATE bookings
SET status='ACCEPTED'
WHERE id=$1 AND technician_id=$2
`,
[bookingId, userId]
);

return { message: "Booking accepted" };

}

async function startBooking(bookingId, userId) {

await pool.query(
`
UPDATE bookings
SET status='IN_PROGRESS'
WHERE id=$1 AND technician_id=$2
`,
[bookingId, userId]
);

return { message: "Booking started" };

}

async function completeBooking(bookingId, userId) {

await pool.query(
`
UPDATE bookings
SET status='COMPLETED'
WHERE id=$1 AND technician_id=$2
`,
[bookingId, userId]
);

await pool.query(
`
UPDATE technicians
SET active_bookings = active_bookings - 1
WHERE user_id = $1
`,
[userId]
);

return { message: "Booking completed" };

}

async function rejectBooking(bookingId, userId) {

await pool.query(
`
UPDATE bookings
SET status='REJECTED'
WHERE id=$1 AND technician_id=$2
`,
[bookingId, userId]
);

await pool.query(
`
UPDATE technicians
SET active_bookings = active_bookings - 1
WHERE user_id = $1
`,
[userId]
);

return { message: "Booking rejected" };

}

module.exports = {
createBooking,
acceptBooking,
startBooking,
completeBooking,
rejectBooking
};
