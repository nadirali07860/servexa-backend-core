const bookingService = require('../bookings/booking.service');
const slotService = require('../slotBooking/slot.service');
const slotLockService = require('../slotLock/slotLock.service');
const dispatchService = require('../../services/dispatchRetry.service');
const auditService = require('../../shared/services/audit.service');

async function rescheduleBooking(req, res, next) {
  try {

    const { bookingId, newSlot } = req.body;
    const user = req.user;

    const booking = await bookingService.getBookingById(bookingId);

    if (!booking) {
      return res.status(404).json({
        message: 'Booking not found'
      });
    }

    /*
    Release old slot
    */

    await slotService.releaseSlot(booking.slot_id);

    /*
    Lock new slot
    */

    const slot = await slotLockService.lockSlot(newSlot);

    /*
    Update booking slot
    */

    await bookingService.updateBookingSlot(bookingId, slot.id);

    /*
    Re-dispatch technician
    */

    await dispatchService.retryDispatch(bookingId);

    /*
    Audit log
    */

    await auditService.log({
      action: 'BOOKING_RESCHEDULED',
      bookingId,
      userId: user.id,
      newSlot
    });

    res.json({
      success: true,
      message: 'Booking rescheduled successfully'
    });

  } catch (err) {
    next(err);
  }
}

module.exports = {
  rescheduleBooking
};
