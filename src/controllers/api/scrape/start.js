/**
 * Scraper Controller
 *
 * Handles web scraping requests using Puppeteer and browser automation.
 * Validates input, executes requested steps, and returns scraped data.
 */

// Helpers
import { helperDoScraping } from '../../../helpers/do-scraping.js';
import { helperScrapeValidateRequestBody } from '../../../helpers/scrape-validate-req-body.js';

/**
 * Main scraper controller function
 *
 * @param {Object} req - Express request object containing scraping configuration and steps
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>} - Returns scraping results
 * @throws {Error} - Forwards errors to the error handler middleware
 */
export async function controllerApiScrapeStart(req, res, next) {
  try {
    // Validate the request body
    const validateValue = helperScrapeValidateRequestBody({ body: req.body });

    // Execute the scraping operation
    const result = await helperDoScraping(validateValue);

    // Return results
    res.send(result);
  } catch (error) {
    next(error);
  }
}
