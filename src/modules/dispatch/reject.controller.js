const dispatchRetryService = require('../../services/dispatchRetry.service');

async function rejectBooking(req, res) {
  try {

    const { bookingId } = req.body;
    const technicianId = req.user.id;

    await dispatchRetryService.dispatchNextTechnician(bookingId, technicianId);

    return res.json({
      success: true,
      message: 'Booking rejected. Reassigning technician.'
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: 'Reject failed',
      error: error.message
    });

  }
}

module.exports = {
  rejectBooking
};
