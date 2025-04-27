/**
 * 404 - Not Found Handler
 * Middleware that captures all requests to undefined routes
 * Customized to hide Express framework information for security
 * Throws a standardized error to be caught by the error handler
 */

/**
 * Route not found handler function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @throws {Error} Standardized 404 error with route information
 */
export function controllerRouteNotFoundHandler(req, res, next) {
  try {
    // Create a custom error with route information for better debugging
    throw new Error(`Route not found - ${req.method} ${req.originalUrl}`);
  } catch (error) {
    res.status(404); // Set the response status to 404
    error.message = `${error.message} - Code: ERROR_ROUTE_NOT_FOUND`; // Append a custom error code for easier identification
    // Forward the error to the central error handler
    next(error);
  };
};