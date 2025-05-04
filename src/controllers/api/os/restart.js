// Node core modules
import { exec } from 'child_process';
import { platform } from 'os';

/**
 * Operating System Restart Controller
 *
 * Provides an endpoint to safely restart the operating system.
 * This should be used with extreme caution as it affects the entire system.
 *
 * Use cases:
 * - During scheduled maintenance windows
 * - When system requires a full restart for updates or configuration changes
 * - After major software deployments that need system reinitialization
 *
 * @param {Object} _req - Express request object (unused but kept for potential future authentication)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function for error handling
 * @returns {void}
 * @throws {Error} Passes error to Express error handler if restart command fails
 */
export function controllerApiOsRestart(_req, res, next) {
  try {
    console.log('OS restart request received. Initiating immediate system restart...');

    // Send response before attempting restart
    res.json({
      success: true,
      data: {
        message:
          'System restart initiated. The server will be restarted immediately and temporarily unavailable.'
      }
    });

    // Schedule the restart with a minimal delay to allow response to be sent
    setTimeout(() => {
      // Use the appropriate command based on the operating system
      const cmd =
        platform() === 'win32'
          ? 'shutdown /r /t 0 /f /c "Scheduled restart via API"'
          : 'sudo shutdown -r now "Scheduled restart via API"';

      exec(cmd, (error) => {
        if (error) {
          console.error(`Restart failed: ${error.message}`);
          // Cannot send response here as it's already sent
          // Log the error for monitoring systems to detect
        }
      });
    }, 1000);
  } catch (error) {
    error.message = `${error.message} - Code: ERROR_API_OS_RESTART`;
    next(error);
  }
}
