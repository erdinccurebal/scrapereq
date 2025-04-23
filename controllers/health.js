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

// Import constants for configuration
import { HEALTH_CHECK_CONFIG, BROWSER_CONFIG } from '../constants.js';

// Constants for configuration
const NODE_ENV = process.env.NODE_ENV || 'development';

// Custom helpers
import { helperBrowserSemaphore } from '../helpers/browser-semaphore.js';
import { helperFormatUptime } from '../helpers/format-uptime.js';

/**
 * Health check controller function - GET /health endpoint handler
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>} - Returns a promise that resolves when the response is sent
 * @throws {Error} - Throws an error if the health check fails
 */
export async function controllerHealth(req, res, next) {
    try {
        // Acquire browser semaphore lock
        await helperBrowserSemaphore.acquire();

        // Get system info
        const uptime = process.uptime();

        // Format uptime to be more readable
        const uptimeFormatted = helperFormatUptime(uptime);

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

        // Configure proxy settings if provided
        const launchOptions = {
            headless: BROWSER_CONFIG.HEADLESS,
            args: [
                BROWSER_CONFIG.ARGS.NO_SANDBOX,
                BROWSER_CONFIG.ARGS.DISABLE_SETUID_SANDBOX,
                BROWSER_CONFIG.ARGS.DISABLE_WEB_SECURITY,
            ],
            ignoreHTTPSErrors: true,
        };

        // Chrome path from environment variable if set
        // This allows for custom Chrome installations or debugging
        if (process.env.CHROME_PATH) {
            launchOptions.executablePath = process.env.CHROME_PATH;
        }

        let browser = null;
        let page = null;

        try {

            const puppeteerVanilla = await import('puppeteer');
            const { addExtra } = await import('puppeteer-extra');
            const puppeteer = addExtra(puppeteerVanilla);

            // Launch browser with minimal options for quick testing
            browser = await puppeteer.launch(launchOptions);

            // Open a new page
            page = await browser.newPage();

            // Navigate to a reliable test page (Google)
            await page.goto(HEALTH_CHECK_CONFIG.TEST_URL, {
                waitUntil: 'networkidle2',
                timeout: HEALTH_CHECK_CONFIG.TIMEOUT
            });

            const resultUrl = page.url();
            const resultTitle = await page.title();

            result.data.app.puppeteer = {
                success: true,
                data: {
                    testUrl: HEALTH_CHECK_CONFIG.TEST_URL,
                    resultUrl,
                    resultTitle,
                    message: 'Puppeteer is working correctly.',
                }
            };
        } catch (error) {
            console.error('Puppeteer Health Check Error:', error.message);
            console.error('Stack Trace:', error.stack);
            result.data.app.puppeteer = {
                success: false,
                data: {
                    testUrl: HEALTH_CHECK_CONFIG.TEST_URL,
                    message: 'Puppeteer is not working correctly.',
                    error: {
                        message: error.message,
                        stack: NODE_ENV === 'development' ? error.stack : null,
                    }
                }
            };
        } finally {
            if (page) {
                await page.close().catch(error => console.error("Error closing page:", error));
            };

            if (browser) {
                await browser.close().catch(error => console.error("Error closing browser:", error));
            };
        };

        if (!result.data.app.puppeteer?.success) {
            result.success = false; // Set success to false if Puppeteer health check fails
        };

        res.json(result);
    } catch (error) {
        next(error); // Pass the error to the error handler
    } finally {
        // Release browser semaphore lock
        helperBrowserSemaphore.release();
    };
};

