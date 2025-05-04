/**
 * Application Shutdown Controller
 *
 * Provides an endpoint to safely shutdown the application with a delayed timer.
 * This allows for graceful termination of connections and processes.
 * Typically used during maintenance or deployment processes.
 *
 * @param {Object} _req - Express request object (unused but kept for middleware signature consistency)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response confirming shutdown initiation
 * @throws {Error} If an error occurs during the shutdown process
 */
export function controllerApiAppShutdown(_req, res, next) {
  try {
    console.log('Application shutdown request received. Shutting down in 3 seconds...');

    // Send immediate response confirming shutdown initiation
    res.json({
      success: true,
      data: {
        message: 'Application is shutting down in 3 seconds...'
      }
    });

    // Set a timeout to allow any pending responses to complete
    setTimeout(() => {
      console.log('Application is shutting down now...');
      process.exit(0); // Exit with success code
    }, 3000);
  } catch (error) {
    error.message = `${error.message} - Code: ERROR_APP_SHUTDOWN`;
    next(error); // Pass any errors to the global error handler
  }
}
