const { dispatchNextTechnician } = require('../../services/dispatchRetry.service');
const logger = require('../../core/logger');

async function technicianReject(req, res) {
  try {

    const { bookingId } = req.body;

    await dispatchNextTechnician(bookingId);

    res.json({
      success: true,
      message: "Dispatch retry triggered"
    });

  } catch (error) {

    logger.error("Technician reject error", {
      error: error.message
    });

    res.status(500).json({
      success: false,
      message: "Dispatch retry failed"
    });

  }
}

module.exports = {
  technicianReject
};
