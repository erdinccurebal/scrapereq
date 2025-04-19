/**
 * Health Check Controller
 * Provides a detailed endpoint to verify that the service and its dependencies are up and running
 * Often used by monitoring tools and load balancers
 * Returns system information and status metrics
 */
import packageJson from '../package.json' with { type: "json" };
import os from 'os';
import process from 'process';
import checkPuppeteerHealth from '../helpers/puppeteer-health.js';

export default async function (req, res, next) {
    try {
        // Get system info
        const uptime = process.uptime();
        const memoryUsage = process.memoryUsage();
        
        // Format uptime to be more readable
        const uptimeFormatted = formatUptime(uptime);
        
        // Calculate memory usage in MB
        const memoryUsageMB = {
            rss: (memoryUsage.rss / 1024 / 1024).toFixed(2), // Resident Set Size
            heapTotal: (memoryUsage.heapTotal / 1024 / 1024).toFixed(2),
            heapUsed: (memoryUsage.heapUsed / 1024 / 1024).toFixed(2),
            external: (memoryUsage.external / 1024 / 1024).toFixed(2)
        };

        // Check if the detailed flag is set to true in query params
        const detailed = req.query.detailed === 'true';
        
        // Basic health info
        const healthInfo = {
            status: 'ok',
            timestamp: new Date().toISOString(),
            service: 'req-scrap',
            version: packageJson.version,
            uptime: uptimeFormatted
        };

        // Add detailed system info if requested
        if (detailed) {
            healthInfo.system = {
                platform: process.platform,
                nodeVersion: process.version,
                cpus: os.cpus().length,
                memoryTotal: `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
                memoryFree: `${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
                load: os.loadavg()
            };
            
            healthInfo.process = {
                pid: process.pid,
                memory: memoryUsageMB
            };
            
            // Add Puppeteer health check if detailed and check-puppeteer flag is true
            if (req.query['check-puppeteer'] === 'true') {
                try {
                    healthInfo.puppeteer = await checkPuppeteerHealth();
                } catch (puppeteerError) {
                    healthInfo.puppeteer = {
                        success: false,
                        error: puppeteerError.message
                    };
                }
            }
        }
        
        // Return health information
        res.status(200).json(healthInfo);
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