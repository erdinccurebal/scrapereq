// Node core modules
import { exec } from 'child_process';

/**
 * Operating System Restart Controller
 * 
 * Provides an endpoint to safely restart the operating system.
 * This should be used with caution as it affects the entire system.
 * Typically used during major maintenance or when the system requires a full restart.
 * 
 * @param {Object} _req - Express request object
 * @param {Object} res - Express response object (unused but kept for middleware signature consistency)
 * @param {Function} next - Express next middleware function
 * @returns {void}
 * @throws {Error} - Throws an error if the restart command fails
 */
export function controllerApiOsRestart(_req, res, next) {
  try {
    console.log('OS restart request received. Initiating immediate system restart...');

    // Send response before attempting restart
    res.json({
      success: true,
      data: {
        message: 'System restart initiated. The server will be restarted immediately and temporarily unavailable.'
      }
    });

    // Schedule the restart with a minimal delay to allow response to be sent
    setTimeout(() => {
      // Use the appropriate command based on the operating system
      const cmd = process.platform === 'win32'
        ? 'shutdown /r /t 0 /f /c "Scheduled restart via API"'
        : 'sudo shutdown -r now "Scheduled restart via API"';

      exec(cmd, (error) => {
        if (error) {
          console.error('Restart failed:', error);
          // Cannot send response here as it's already sent
        }
      });
    }, 1000);

  } catch (error) {
    error.message = `${error.message} - Code: ERROR_API_OS_RESTART`;
    next(error);
  }
}