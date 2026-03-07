const asyncHandler = require('../../shared/utils/asyncHandler');
const AppError = require('../../shared/utils/AppError');
const ratingService = require('./rating.service');

const submitRating = asyncHandler(async (req, res) => {

  if (req.user.role !== 'CUSTOMER') {
    throw new AppError('Only customers can submit ratings', 403);
  }

  const { booking_id, rating, review } = req.body;

  if (!booking_id || !rating) {
    throw new AppError('booking_id and rating are required', 400);
  }

  const result = await ratingService.submitRating({
    booking_id,
    customer_id: req.user.id,
    rating,
    review
  });

  res.json(result);
});

module.exports = {
  submitRating
};
