import createResponse from "../utils/responseBuilder.js";

const globalErrorHandler = (error, req, res, next) => {
  error = error || {};

  // Default error structure
  const statusCode = error.statusCode || 500; // Default to 500
  const isSuccess = false;
  const message = error.message || "An unexpected error occurred.";
  const errorDetails = error.details || null;

  // Log the error for debugging purposes
  console.error("Global Error Handler:", error.stack || error.message || error);

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
