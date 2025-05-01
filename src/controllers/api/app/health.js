/**
 * Health Check Controller
 * Provides a detailed endpoint to verify that the service and its dependencies are up and running
 * Often used by monitoring tools and load balancers
 * Returns system information and status metrics
 */

// Node core modules
import os from 'os';
import process from 'process';

// Import package.json as JSON module for version information
import packageJson from '../../../../package.json' with { type: "json" };

// Custom helpers
import { helperFormatUptime } from '../../../helpers/format-uptime.js';

/**
 * Health check controller function - GET /health endpoint handler
 * @param {Object} _req - Express request object (unused, prefixed with underscore)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>} - Returns a promise that resolves when the response is sent
 * @throws {Error} - Throws an error if the health check fails
 */
export async function controllerApiAppHealth(_req, res, next) {
    try {
        // Prepare comprehensive health check response
        const result = {
            success: true, // Overall status indicator
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
 * 
 * @returns {Object} - Project data including name, description, version, author, and license
 * @throws {Error} - Throws an error if loading project data fails
 */
function loadProjectData() {
    try {
        // Load project data from package.json
        return {
            name: packageJson.name,
            description: packageJson.description,
            version: packageJson.version,
            author: packageJson.author,
            license: packageJson.license,
        };
    } catch (error) {
        error.message = `${error.message} - Code: ERROR_API_APP_HEALTH_CHECK_LOAD_PROJECT_DATA`;
        throw error;
    }
}

/**
 * Load application data from the Express app
 *  
 * @param {Object} options - Options object
 * @param {Object} options.res - Express response object with app context
 * @returns {Object} - Application data including environment, port, host, uptime, and process ID
 * @throws {Error} - Throws an error if loading application data fails
 */
function loadAppData({ res }) {
    try {
        // Get system info
        const uptime = process.uptime();

        // Format uptime to be more readable
        const uptimeFormatted = helperFormatUptime(uptime);

        // Get the application name from the request object
        return {
            environment: res.app.get('env'),
            port: res.app.get('port'),
            host: res.app.get('host'),
            uptime: uptimeFormatted,
            pid: process.pid
        };
    } catch (error) {
        error.message = `${error.message} - Code: ERROR_API_APP_HEALTH_CHECK_LOAD_APP_DATA`;
        throw error;
    }
}

/**
 * Load system data using the os module
 *  
 * @returns {Object} - System data including timestamp, timezone, platform, architecture, release, CPU count, total memory, and free memory
 * @throws {Error} - Throws an error if loading system data fails
 */
function loadSystemData() {
    try {
        // Get system information using the os module
        return {
            timestamp: new Date().toISOString(),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            platform: os.platform(),
            arch: os.arch(),
            release: os.release(),
            cpus: os.cpus().length,
            totalmem: (os.totalmem() / 1024 / 1024).toFixed(2), // Total memory in MB
            freemem: (os.freemem() / 1024 / 1024).toFixed(2), // Free memory in MB
        };
    } catch (error) {
        error.message = `${error.message} - Code: ERROR_API_APP_HEALTH_CHECK_LOAD_SYSTEM_DATA`;
        throw error;
    }
}
