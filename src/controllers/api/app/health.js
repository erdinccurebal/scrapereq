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

// Import constants for configuration
import { HEALTH_CHECK_CONFIG, BROWSER_CONFIG } from '../../../constants.js';

// Constants for configuration
const NODE_ENV = process.env.NODE_ENV || 'development';

// Custom helpers
import { helperBrowserSemaphore } from '../../../helpers/browser-semaphore.js';
import { helperFormatUptime } from '../../../helpers/format-uptime.js';

/**
 * Health check controller function - GET /health endpoint handler
 * @param {Object} _req - Express request object (unused, prefixed with underscore)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>} - Returns a promise that resolves when the response is sent
 * @throws {Error} - Throws an error if the health check fails
 */
export async function controllerApiHealth(_req, res, next) {
    try {

        // Acquire browser semaphore lock
        await helperBrowserSemaphore.acquire();

        // Prepare comprehensive health check response
        const result = {
            success: true, // Overall status indicator
            data: {
                project: loadProjectData(),
                app: await loadAppData({ res }),
                system: loadSystemData()
            }
        };

        // Check if Puppeteer is enabled in the configuration
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
        error.message = `${error.message} - Code: ERROR_HEALTH_CHECK_LOAD_PROJECT_DATA`;
        throw error;
    };
};

/**
 * Load application data from the Express app
 *  
 * @param {Object} options - Options object
 * @param {Object} options.res - Express response object with app context
 * @returns {Object} - Application data including environment, port, host, uptime, and process ID
 * @throws {Error} - Throws an error if loading application data fails
 */
async function loadAppData({ res }) {
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
            pid: process.pid,
            puppeteer: await loadPuppeteerData()
        };
    } catch (error) {
        error.message = `${error.message} - Code: ERROR_HEALTH_CHECK_LOAD_APP_DATA`;
        throw error;
    };
};

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
        error.message = `${error.message} - Code: ERROR_HEALTH_CHECK_LOAD_SYSTEM_DATA`;
        throw error;
    };
};

/**
 * Load Puppeteer data by performing a quick browser test
 *  
 * @returns {Object} - Puppeteer health check data including success status, test URL, result URL, page title, and message
 * @throws {Error} - Throws an error if loading Puppeteer data fails
 */
async function loadPuppeteerData() {

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
    };

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

        const responseData = {
            success: true,
            data: {
                testUrl: HEALTH_CHECK_CONFIG.TEST_URL,
                resultUrl,
                resultTitle,
                message: 'Puppeteer is working correctly.',
            }
        };
        console.log('Puppeteer Health Check Success:', responseData);
        return responseData;
    } catch (error) {
        const responseData = {
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
        console.error('Puppeteer Health Check Error:', responseData);
        return responseData;
    } finally {
        if (page) {
            await page.close().catch(error => console.error("Error closing page:", error));
        };

        if (browser) {
            await browser.close().catch(error => console.error("Error closing browser:", error));
        };
    };
};