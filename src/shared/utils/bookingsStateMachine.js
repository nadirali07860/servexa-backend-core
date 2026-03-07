const AppError = require('./AppError');

const transitions = {
  CREATED: ['ASSIGNED', 'PENDING_DISPATCH', 'DISPATCH_FAILED'],
  ASSIGNED: ['ACCEPTED', 'REJECTED_BY_TECH'],
  ACCEPTED: ['IN_PROGRESS'],
  IN_PROGRESS: ['COMPLETED'],
  PENDING_DISPATCH: ['ASSIGNED', 'DISPATCH_FAILED'],
  DISPATCH_FAILED: [],
  COMPLETED: [],
  REJECTED_BY_TECH: []
};

function validateTransition(currentStatus, nextStatus) {
  const allowed = transitions[currentStatus];

  if (!allowed || !allowed.includes(nextStatus)) {
    throw new AppError(
      `Invalid booking status transition: ${currentStatus} → ${nextStatus}`,
      400
    );
  }
}

module.exports = {
  validateTransition
};
