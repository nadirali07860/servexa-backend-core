const asyncHandler = require('../../shared/utils/asyncHandler');
const refundService = require('./refund.service');

/* =========================
   CUSTOMER → Request Refund
========================= */
exports.requestRefund = asyncHandler(async (req, res) => {
  const { booking_id, reason } = req.body;
  const result = await refundService.requestRefund(
    req.user,
    booking_id,
    reason
  );
  res.json(result);
});

/* =========================
   ADMIN → Approve Refund
========================= */
exports.approveRefund = asyncHandler(async (req, res) => {
  const { refund_id } = req.body;
  const result = await refundService.approveRefund(refund_id);
  res.json(result);
});

/* =========================
   ADMIN → Reject Refund
========================= */
exports.rejectRefund = asyncHandler(async (req, res) => {
  const { refund_id } = req.body;
  const result = await refundService.rejectRefund(refund_id);
  res.json(result);
});
