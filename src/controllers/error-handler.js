/**
 * Global Error Handler Middleware
 *
 * This middleware captures all errors thrown during request processing
 * and formats them into a consistent JSON response structure.
 * It's customized to hide framework-specific information for security purposes.
 *
 * @param {Error} error - The error object captured by Express
 * @param {Request} _req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} _next - Express next middleware function
 * @returns {void} - Sends a JSON response with the error details
 */
export function controllerErrorHandler(error, _req, res, _next) {
  // Log the complete error to server console for debugging
  console.error(error);

  // Create standardized error response structure
  const result = {
    success: false,
    data: {
      message: null
    }
  };

  // Format error message based on error type
  if (error.name === 'ValidationError') {
    // Handle Joi validation errors with more details
    result.data.message = formatValidationError(error);
  } else if (error.message) {
    // For general errors with messages
    result.data.message = formatErrorMessage(error.message);
  } else {
    // Default message if error doesn't contain one
    result.data.message = 'Internal Server Error';
  }

  // Include stack trace only in development environment
  if (process.env.NODE_ENV === 'development' && error.stack) {
    result.data.stack = formatStackTrace(error.stack);
  }

  // Add screenshot path to data object (if exists)
  if (error.screenshotUrl) {
    result.data.screenshotUrl = error.screenshotUrl;
  }

  // Extract error code if available, otherwise use a default
  if (result.data.message.includes('Code: ERROR_')) {
    result.data.code = 'ERROR_' + result.data.message.split('Code: ERROR_')[1].split(' ')[0];
  } else {
    result.data.code = 'ERROR_UNKNOWN';
  }

  // Include proxy information if available
  if (error.proxy) {
    result.data.proxy = error.proxy;
  }

  // Send response with appropriate status code
  // Use existing status code if set, otherwise default to 500
  res.status(res.statusCode || 500).json(result);
}

/**
 * Format validation error messages to be more user-friendly
 *
 * @param {Error} error - Validation error object (typically Joi validation error)
 * @returns {string} Formatted validation error message
 */
function formatValidationError(error) {
  // For Joi validation errors with details array
  if (error.details && Array.isArray(error.details)) {
    return error.details.map((detail) => formatErrorMessage(detail.message)).join(', ');
  }

  // For custom validation errors that include the ValidationError text
  if (error.message && error.message.includes('ValidationError')) {
    return formatErrorMessage(error.message.replace('ValidationError: ', ''));
  }

  // Fallback for other validation errors
  return formatErrorMessage(error.message) || 'Validation failed';
}

/**
 * Format any error message to remove escape characters and improve readability
 *
 * @param {string} message - The error message to format
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
 * Format stack trace for error responses
 * Returns a simplified version of the stack trace for better readability
 *
 * @param {string} stackTrace - Raw stack trace string
 * @returns {Array<string>|null} Formatted stack trace as array of lines or null if not available
 */
function formatStackTrace(stackTrace) {
  if (!stackTrace) return null;

  // Split stack by lines and take first 10 lines for conciseness
  return stackTrace
    .split('\n')
    .map((line) => line.trim())
    .slice(0, 10);
}
