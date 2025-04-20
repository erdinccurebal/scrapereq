/**
 * Puppeteer Health Check Helper
 * Tests if Puppeteer can successfully launch and navigate to a test page
 * Returns the status of Puppeteer's functionality
 */

// Node modules
import puppeteer from 'puppeteer';

// Import constants for configuration
import { HEALTH_CHECK_CONFIG, BROWSER_CONFIG } from '../constants.js';

// Browser semaphore for controlling browser access
import browserSemaphore from './browser-semaphore.js';

// Constants for configuration
const NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Simple test to check if Puppeteer can launch and perform basic navigation
 * @returns {Promise<Object>} Status object with success flag and additional info
 */
export default async function checkPuppeteerHealth() {
    let browser = null;
    let page = null;

    try {
        // Acquire browser semaphore lock
        await browserSemaphore.acquire();

        // Configure proxy settings if provided
        const launchOptions = {
            headless: BROWSER_CONFIG.HEADLESS,
            args: [BROWSER_CONFIG.ARGS.NO_SANDBOX, BROWSER_CONFIG.ARGS.DISABLE_SETUID_SANDBOX],
        };

        // Chrome path from environment variable if set
        // This allows for custom Chrome installations or debugging
        if (process.env.CHROME_PATH) {
            launchOptions.executablePath = process.env.CHROME_PATH;
        }

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

        return {
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
        return {
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
        // Clean up resources properly
        if (page) await page.close();
        if (browser) await browser.close();
        
        // Release browser semaphore lock
        browserSemaphore.release();
    }
}