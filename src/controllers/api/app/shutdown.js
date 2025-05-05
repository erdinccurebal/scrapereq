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
import { TIME_CONSTANTS } from '../../../constants.js';

export function controllerApiAppShutdown(_req, res, next) {
  try {
    console.log(
      `Application shutdown request received. Shutting down in ${TIME_CONSTANTS.SHUTDOWN_DELAY_MS / 1000} seconds...`
    );

    // Send immediate response confirming shutdown initiation
    res.json({
      success: true,
      data: {
        message: `Application is shutting down in ${TIME_CONSTANTS.SHUTDOWN_DELAY_MS / 1000} seconds...`
      }
    });

    // Set a timeout to allow any pending responses to complete
    setTimeout(() => {
      console.log('Application is shutting down now...');
      // Exit with success code - process.exit(0) is appropriate here
      // as we're performing a controlled shutdown
      process.exit(0);
    }, TIME_CONSTANTS.SHUTDOWN_DELAY_MS);
  } catch (error) {
    error.code = 'ERROR_APP_SHUTDOWN';
    next(error);
  }
}
