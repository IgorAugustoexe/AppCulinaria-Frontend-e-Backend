const successResponse = (res, status, message, data) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

const errorResponse = (res, status, message) => {
  return res.status(status).json({
    success: false,
    message,
  });
};

const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const status = error.status || 500;

  return errorResponse(res, status, error.message || "Erro interno do servidor");
};

module.exports = {
  errorHandler,
  errorResponse,
  successResponse,
};
