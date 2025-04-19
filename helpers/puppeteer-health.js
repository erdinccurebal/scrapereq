/**
 * Puppeteer Health Check Helper
 * Tests if Puppeteer can successfully launch and navigate to a test page
 * Returns the status of Puppeteer's functionality
 */

// Node modules
import puppeteer from 'puppeteer';

// Constants for configuration
const DEFAULT_HIGHER_TIMEOUT = parseInt(process.env.DEFAULT_HIGHER_TIMEOUT || 30000); // 30 seconds timeout for longer operations
const PUPPETEER_TEST_URL = process.env.DEFAULT_HIGHER_TIMEOUT || 'https://www.google.com';
const NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Simple test to check if Puppeteer can launch and perform basic navigation
 * @returns {Promise<Object>} Status object with success flag and additional info
 */
export default async function checkPuppeteerHealth() {
    let browser = null;
    let page = null;

    try {
        // Launch browser with minimal options for quick testing
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        // Open a new page
        page = await browser.newPage();

        // Navigate to a reliable test page (Google)
        await page.goto(PUPPETEER_TEST_URL, {
            waitUntil: 'networkidle2',
            timeout: DEFAULT_HIGHER_TIMEOUT // Shorter timeout for health check
        });

        const resultUrl = page.url();
        const resultTitle = await page.title();

        return {
            success: true,
            data: {
                testUrl: PUPPETEER_TEST_URL,
                resultUrl,
                resultTitle,
                message: 'Puppeteer is working correctly.',
            }
        };
    } catch (error) {
        return {
            success: false,
            data: {
                testUrl: PUPPETEER_TEST_URL,
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
    }
}