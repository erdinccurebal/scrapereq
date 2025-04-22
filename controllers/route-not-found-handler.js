/**
 * 404 - Not Found Handler
 * Middleware that captures all requests to undefined routes
 * Customized to hide Express framework information for security
 * Throws a standardized error to be caught by the error handler
 */

/**
 * Route not found handler function
 * @param {Object} req - Express request object
 * @param {Object} _res - Express response object
 * @param {Function} next - Express next middleware function
 * @throws {Error} Standardized 404 error with route information
 */
export function controllerRouteNotFoundHandler(req, _res, next) {
  try {
    // Create a custom error with route information for better debugging
    throw new Error(`Route not found - ${req.method} ${req.originalUrl}`);
  } catch (error) {
    // Forward the error to the central error handler
    next(error);
  };
};