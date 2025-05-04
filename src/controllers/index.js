/**
 * Main App Controller
 * Handles the root endpoint of the application
 *
 * @param {Object} _req - Express request object (unused, prefixed with underscore)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} - Returns a simple welcome message
 */
export function controllerIndex(_req, res, next) {
  try {
    // Send a welcome message with basic API information
    res.json({
      success: true,
      message: 'Welcome to Scrapereq API',
      version: '1.0.0',
      documentation: '/api/docs'
    });
  } catch (error) {
    error.message = `${error.message} - Code: ERROR_INDEX`;
    next(error); // Fixed: was incorrectly passing 'next' instead of 'error'
  }
}
