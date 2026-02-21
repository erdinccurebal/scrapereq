/**
 * 404 - Not Found Handler
 *
 * Middleware that captures all requests to undefined routes.
 * Provides a clean 404 response without exposing Express framework details.
 * Creates a standardized error with route information to be processed by the central error handler.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} - Passes control to the error handler middleware
 */
export function controllerRouteNotFoundHandler(req, res, next) {
  // Set the response status to 404 first
  res.status(404);

  // Create error with detailed route information and standardized error code
  const error = new Error(`Route not found - ${req.method} ${req.originalUrl}`);

  // Add additional context for debugging
  error.status = 404;
  error.path = req.originalUrl;
  error.method = req.method;
  error.code = 'ERROR_ROUTE_NOT_FOUND';

  // Forward to the central error handler middleware
  next(error);
}
