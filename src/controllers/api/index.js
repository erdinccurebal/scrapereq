/**
 * API Root Controller
 * Handles the root endpoint of the API
 *
 * @param {Object} _req - Express request object (unused, prefixed with underscore)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} - Returns API information and available endpoints
 */
export function controllerApiIndex(_req, res, next) {
  try {
    // Send API information with available endpoints
    res.json({
      success: true,
      message: 'Scrapereq API',
      version: '1.0.0',
      endpoints: {
        scrape: '/api/scrape',
        app: '/api/app',
        os: '/api/os',
        docs: '/api/docs'
      }
    });
  } catch (error) {
    error.message = `${error.message} - Code: ERROR_API_INDEX`;
    next(error); // Fixed: was incorrectly passing 'next' instead of 'error'
  }
}
