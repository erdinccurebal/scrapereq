/**
 * Test Scraper Controller
 *
 * Runs a predefined scraping test using a fixed configuration from constants.
 * Uses a preset configuration for testing the scraping functionality.
 */

// Helpers
import { helperDoScraping } from '../../../helpers/do-scraping.js';
import { helperScrapeValidateRequestBody } from '../../../helpers/scrape-validate-req-body.js';

// Constants
import { SCRAPE_TEST_REQ_BODY } from '../../../constants.js';

/**
 * Test controller for web scraping functionality
 *
 * @param {Object} _req - Express request object (not used in this controller)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>} - Returns scraping test results
 * @throws {Error} - Forwards errors to the error handler middleware
 */
export async function controllerApiScrapeTest(_req, res, next) {
  try {
    // Validate the predefined test configuration
    const validateValue = helperScrapeValidateRequestBody({ body: SCRAPE_TEST_REQ_BODY });

    // Execute the scraping operation
    const result = await helperDoScraping(validateValue);

    // Return results
    res.send(result);
  } catch (error) {
    next(error);
  }
}
