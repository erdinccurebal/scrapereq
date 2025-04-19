/**
 * Health Check Controller
 * Provides a detailed endpoint to verify that the service and its dependencies are up and running
 * Often used by monitoring tools and load balancers
 * Returns system information and status metrics
 */
// Import package.json as JSON module for version information
import packageJson from '../package.json' with { type: "json" };

// Node core modules
import os from 'os';
import process from 'process';

// Custom helpers
import checkPuppeteerHealth from '../helpers/puppeteer-health.js';

/**
 * Health check controller function - GET /health endpoint handler
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with health status information
 */
export default async function (req, res, next) {
    try {
        // Get system info
        const uptime = process.uptime();

        // Format uptime to be more readable
        const uptimeFormatted = formatUptime(uptime);

        // Prepare comprehensive health check response
        const result = {
            success: true, // Overall status indicator
            data: {
                project: {
                    name: packageJson.name,
                    description: packageJson.description,
                    version: packageJson.version,
                    author: packageJson.author,
                    license: packageJson.license,
                },
                app: {
                    environment: res.app.get('env'),
                    port: req.app.get('port'),
                    host: res.app.get('host'),
                    uptime: uptimeFormatted,
                    pid: process.pid,
                    puppeteer: null
                },
                system: {
                    timestamp: new Date().toISOString(),
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    platform: os.platform(),
                    arch: os.arch(),
                    release: os.release(),
                    cpus: os.cpus().length,
                    totalmem: (os.totalmem() / 1024 / 1024).toFixed(2), // Total memory in MB
                    freemem: (os.freemem() / 1024 / 1024).toFixed(2), // Free memory in MB
                },
            }
        };

        result.data.app.puppeteer = await checkPuppeteerHealth();

        res.json(result);
    } catch (error) {
        next(error); // Pass the error to the error handler
    }
}

/**
 * Format the uptime into a human-readable string
 * @param {number} uptime - Uptime in seconds
 * @returns {string} Formatted uptime string
 */
function formatUptime(uptime) {
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

    return parts.join(' ');
}