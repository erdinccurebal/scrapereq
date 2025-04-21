/**
 * Global Error Handler Middleware
 * 
 * This middleware captures all errors thrown during request processing
 * and formats them into a consistent JSON response structure.
 * It's customized to hide framework-specific information for security purposes.
 * 
 * @param {Error} error - The error object captured by Express
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 */

export default (error, _req, res, _next) => {
  // Log the complete error to server console for debugging
  console.error(error);

  // Create standardized error response structure
  const result = {
    success: false,
    data: {
      message: null,
      stack: null
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
  if (error.screenshot) {
    result.data.screenshot = error.screenshot;
  }

  // Send response with appropriate status code
  // Use existing status code if set, otherwise default to 500
  res.status(500).json(result);
};

/**
 * Format validation error messages to be more user-friendly
 * 
 * @param {Error} error - Validation error object
 * @return {string} Formatted validation error message
 */
function formatValidationError(error) {
  // For Joi validation errors
  if (error.details && Array.isArray(error.details)) {
    return error.details.map(detail => formatErrorMessage(detail.message)).join(', ');
  }

  // For custom validation errors
  if (error.message && error.message.includes('ValidationError')) {
    // Clean up the validation error message
    return formatErrorMessage(error.message.replace('ValidationError: ', ''));
  }

  return formatErrorMessage(error.message) || 'Validation failed';
}

/**
 * Format any error message to remove escape characters and improve readability
 * 
 * @param {string} message - The error message to format
 * @return {string} Cleaned error message
 */
function formatErrorMessage(message) {
  if (!message) return '';

  return message
    .replace(/\\"/g, '"')  // Replace escaped quotes with regular quotes
    .replace(/"/g, '\'')   // Replace double quotes with single quotes
    .trim();
}

/**
 * Format stack trace for error responses
 * Simple version without complex formatting
 * 
 * @param {string} stackTrace - Raw stack trace string
 * @return {Array} Basic stack trace as array of lines
 */
function formatStackTrace(stackTrace) {
  if (!stackTrace) return null;

  // Split stack by lines and take first 10 lines
  return stackTrace
    .split('\n')
    .map(line => line.trim())
    .slice(0, 10);
}
