/**
 * Main App Controller
 * Handles the root endpoint of the application
 *
 * @param {Object} _req - Express request object (unused, prefixed with underscore)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} - Sends a JSON response with API information
 */
export function controllerIndex(_req, res, next) {
  try {
    // Send a welcome message with API information
    res.json({
      success: true,
      message: 'Welcome to Scrapereq API',
      version: process.env.npm_package_version || '1.0.0',
      documentation: '/api/docs',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    // Add standardized error code for easier debugging
    error.message = `${error.message} - Code: ERROR_INDEX`;
    next(error);
  }
}
