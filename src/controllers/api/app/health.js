/**
 * Health Check Controller
 * Provides a detailed endpoint to verify that the service and its dependencies are operational.
 * Used by monitoring tools and load balancers to check system health.
 * Returns comprehensive system information and status metrics.
 */

// Node core modules
import os from 'os';
import process from 'process';

// Import package.json as JSON module for version information
import packageJson from '../../../../package.json' with { type: 'json' };

// Helpers
import { helperFormatUptime } from '../../../helpers/format-uptime.js';

// Constants
import { MEMORY_CONSTANTS } from '../../../constants.js';

/**
 * Health check controller function - GET /health endpoint handler
 * @param {Object} _req - Express request object (unused, prefixed with underscore)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>} - Resolves when the response is sent
 */
export async function controllerApiAppHealth(_req, res, next) {
  try {
    // Prepare comprehensive health check response
    const result = {
      success: true,
      data: {
        project: loadProjectData(),
        app: loadAppData({ res }),
        system: loadSystemData()
      }
    };

    res.json(result);
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
}

/**
 * Load project data from package.json
 * @returns {Object} Project metadata
 */
function loadProjectData() {
  try {
    return {
      name: packageJson.name,
      description: packageJson.description,
      version: packageJson.version,
      author: packageJson.author,
      license: packageJson.license
    };
  } catch (error) {
    error.code = 'ERROR_API_APP_HEALTH_CHECK_LOAD_PROJECT_DATA';
    throw error;
  }
}

/**
 * Load application data from the Express app
 * @param {Object} options - Options object
 * @param {Object} options.res - Express response object with app context
 * @returns {Object} Application runtime information
 */
function loadAppData({ res }) {
  try {
    const uptime = process.uptime();
    const uptimeFormatted = helperFormatUptime(uptime);

    // Get application configuration from Express app settings
    return {
      environment: res.app.get('env'),
      port: res.app.get('port'),
      host: res.app.get('host'),
      uptime: uptimeFormatted,
      pid: process.pid
    };
  } catch (error) {
    error.code = 'ERROR_API_APP_HEALTH_CHECK_LOAD_APP_DATA';
    throw error;
  }
}

/**
 * Load system data using the os module
 * @returns {Object} Host system information
 */
function loadSystemData() {
  try {
    return {
      timestamp: new Date().toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      platform: os.platform(),
      arch: os.arch(),
      release: os.release(),
      cpus: os.cpus().length,
      totalmem: (os.totalmem() / MEMORY_CONSTANTS.BYTES_TO_MB).toFixed(2), // Total memory in MB
      freemem: (os.freemem() / MEMORY_CONSTANTS.BYTES_TO_MB).toFixed(2) // Free memory in MB
    };
  } catch (error) {
    error.code = 'ERROR_API_APP_HEALTH_CHECK_LOAD_SYSTEM_DATA';
    throw error;
  }
}
