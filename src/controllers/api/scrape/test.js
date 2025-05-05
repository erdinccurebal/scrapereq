/**
 * Test Scraper Controller
 *
 * Advanced endpoint for testing scraper functionality
 * Performs a basic browser test to validate Puppeteer is working correctly
 */

// Import packages
import puppeteer from 'puppeteer';

// Import central configuration
import { config } from '../../../config.js';

/**
 * Test endpoint controller - POST /api/scrape/test handler
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>} - Returns detailed test results or error information
 */
export async function controllerApiScrapeTest(req, res, next) {
  let browser = null;

  try {
    // Launch options for test browser
    const launchOptions = {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security'],
      ignoreHTTPSErrors: true
    };

    // Add chromium path from config if available
    if (config.browser.chromePath) {
      launchOptions.executablePath = config.browser.chromePath;
    }

    // Testing a simple website load
    const testUrl = 'https://example.com';

    // Launch browser and open a page
    browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    // Set a reasonable timeout
    page.setDefaultTimeout(10000);

    // Navigate to test URL
    await page.goto(testUrl, { waitUntil: 'domcontentloaded' });

    // Get page title and URL for verification
    const pageTitle = await page.title();
    const pageUrl = page.url();

    // Take a small screenshot for visual verification
    const screenshot = await page.screenshot({ encoding: 'base64', type: 'jpeg', quality: 50 });

    // Close browser
    await browser.close();
    browser = null;

    // Return detailed success response
    res.json({
      success: true,
      data: {
        message: 'Scraper test completed successfully',
        test_url: testUrl,
        result_url: pageUrl,
        page_title: pageTitle,
        browser_version: await puppeteer.browser.version(),
        timestamp: new Date().toISOString(),
        screenshot: `data:image/jpeg;base64,${screenshot}`
      }
    });
  } catch (error) {
    // Provide detailed error information
    error.code = 'ERROR_SCRAPER_TEST';

    // Ensure browser is closed if an error occurs
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error('Error closing browser during error handling:', closeError);
      }
    }

    next(error);
  }
}
