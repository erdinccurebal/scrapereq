/**
 * Global Error Handler Middleware
 *
 * Captures all Express errors and transforms them into a consistent JSON response.
 * Hides implementation details for security while providing useful error information.
 *
 * @param {Error} error - The caught error object
 * @param {Request} _req - Express request object (unused but required by Express)
 * @param {Response} res - Express response object
 * @param {Function} _next - Express next middleware function (unused but required by Express)
 * @returns {void} - Sends a JSON response with structured error details
 */
export function controllerErrorHandler(error, _req, res, _next) {
  // Log full error for server-side debugging
  console.error(error);

  // Initialize standardized error response
  const result = {
    success: false,
    data: {
      message: null,
      code: error.code || 'ERROR_UNKNOWN'
    }
  };

  // Determine appropriate HTTP status code
  const statusCode = error.status ? Number(error.status) : 500;

  // Set appropriate error message based on error type
  result.data.message =
    error.name === 'ValidationError'
      ? formatValidationError(error)
      : error.message
        ? formatErrorMessage(error.message)
        : 'Internal Server Error';

  // Include stack trace only in development environment
  if (process.env.NODE_ENV === 'development' && error.stack) {
    result.data.stack = formatStackTrace(error.stack);
  }

  // Add additional error context if available
  if (error.screenshotUrl) {
    result.data.screenshotUrl = error.screenshotUrl;
  }

  if (error.proxy) {
    result.data.proxy = error.proxy;
  }

  // Send response with determined status code
  res.status(statusCode).json(result);
}

/**
 * Format validation errors into user-friendly messages
 * Handles both Joi validation errors and custom validation errors
 *
 * @param {Error} error - Validation error object
 * @returns {string} Formatted validation error message
 */
function formatValidationError(error) {
  // Handle Joi validation errors with details array
  if (error.details && Array.isArray(error.details)) {
    return error.details.map((detail) => formatErrorMessage(detail.message)).join(', ');
  }

  // Handle custom validation errors
  if (error.message && error.message.includes('ValidationError')) {
    return formatErrorMessage(error.message.replace('ValidationError: ', ''));
  }

  // Fallback for other validation error types
  return formatErrorMessage(error.message) || 'Validation failed';
}

/**
 * Sanitize error messages for consistent display and improved security
 * Removes escape characters and converts quotes for better readability
 *
 * @param {string} message - Raw error message
 * @returns {string} Cleaned error message
 */
function formatErrorMessage(message) {
  if (!message) return '';

  return message
    .replace(/\\"/g, '"') // Replace escaped quotes with regular quotes
    .replace(/"/g, "'") // Replace double quotes with single quotes
    .trim();
}

/**
 * Create a simplified stack trace for better debugging in development
 * Limits stack trace to first 10 lines to prevent excessive response size
 *
 * @param {string} stackTrace - Raw error stack trace
 * @returns {Array<string>|null} Formatted stack trace array or null if unavailable
 */
function formatStackTrace(stackTrace) {
  if (!stackTrace) return null;

  return stackTrace
    .split('\n')
    .map((line) => line.trim())
    .slice(0, 10);
}
