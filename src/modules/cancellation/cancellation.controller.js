const bookingService = require('../bookings/booking.service');
const refundService = require('../refunds/refund.service');
const dispatchService = require('../../services/dispatchRetry.service');
const auditService = require('../../shared/services/audit.service');

async function cancelBooking(req, res, next) {

  try {

    const { bookingId, reason } = req.body;
    const user = req.user;

    const booking = await bookingService.getBookingById(bookingId);

    if (!booking) {
      return res.status(404).json({
        message: 'Booking not found'
      });
    }

    let cancelType = '';

    if (user.role === 'customer') {
      cancelType = 'CANCELLED_BY_CUSTOMER';
    }

    if (user.role === 'technician') {
      cancelType = 'CANCELLED_BY_TECHNICIAN';
    }

    if (user.role === 'admin') {
      cancelType = 'CANCELLED_BY_ADMIN';
    }

    await bookingService.updateBookingStatus(
      bookingId,
      cancelType
    );

    await refundService.processRefund(bookingId);

    if (cancelType === 'CANCELLED_BY_TECHNICIAN') {
      await dispatchService.retryDispatch(bookingId);
    }

    await auditService.log({
      action: 'BOOKING_CANCELLED',
      bookingId,
      userId: user.id,
      reason
    });

    res.json({
      success: true,
      message: 'Booking cancelled successfully'
    });

  } catch (err) {
    next(err);
  }

}

module.exports = {
  cancelBooking
};
