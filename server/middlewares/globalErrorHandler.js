import createResponse from "../utils/responseBuilder.js";

const globalErrorHandler = (err, req, res, next) => {
  err = err || {};

  // Default error structure
  const statusCode = err.statusCode || 500; // Default to 500
  const isSuccess = false;
  const message = err.message || "An unexpected error occurred.";
  const errorDetails = err.details || null;

  // Log the error for debugging purposes
  console.error("Global Error Handler:", err.stack || err.message || err);

  // Send the error response
  res.status(statusCode).json(
    createResponse({
      isSuccess,
      statusCode,
      message,
      data: null,
      error: errorDetails || message,
    })
  );
};

export default globalErrorHandler;
