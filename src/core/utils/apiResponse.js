function sendSuccess(res, data = null, message = 'Success') {
  return res.status(200).json({
    success: true,
    message,
    data,
    requestId: res.req.requestId,
  });
}

function sendCreated(res, data = null, message = 'Created successfully') {
  return res.status(201).json({
    success: true,
    message,
    data,
    requestId: res.req.requestId,
  });
}

function sendError(res, message = 'Something went wrong', status = 500) {
  return res.status(status).json({
    success: false,
    message,
    requestId: res.req.requestId,
  });
}

module.exports = {
  sendSuccess,
  sendCreated,
  sendError,
};
