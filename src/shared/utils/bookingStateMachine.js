const allowedTransitions = {
  CREATED: ['ASSIGNED', 'CANCELLED'],
  ASSIGNED: ['ACCEPTED', 'REJECTED', 'CANCELLED'],
  ACCEPTED: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['COMPLETED'],
  COMPLETED: [],
  REJECTED: [],
  CANCELLED: []
};

function validateTransition(currentStatus, nextStatus) {
  const allowed = allowedTransitions[currentStatus] || [];

  if (!allowed.includes(nextStatus)) {
    throw new Error(
      `Invalid booking status transition from ${currentStatus} to ${nextStatus}`
    );
  }
}

module.exports = {
  validateTransition
};
