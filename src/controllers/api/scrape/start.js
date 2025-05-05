/**
 * Scraper Controller
 * Handles web scraping requests using Puppeteer and Replay
 * Executes predefined steps on target websites and returns the results
 */

// Helper functions
import { helperValidatorsApiScrapeStart } from '../../../helpers/validators.js';
import { helperDoScraping } from '../../../helpers/do-scraping.js';

/**
 * Main scraper controller function
 * Processes incoming web scraping requests and executes defined steps on target websites
 *
 * @param {Object} req - Express request object containing scraping configuration and steps
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>} - Returns a promise that resolves when the scraping is complete
 * @throws {Error} - Throws an error if the scraping process fails
 */
export async function controllerApiScrapeStart(req, res, next) {
  try {
    const validateValue = validateRequestBody({ body: req.body });
    const result = await helperDoScraping(validateValue);
    res.send(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Validates the request body against the defined schema
 *
 * @param {Object} options - Options object
 * @param {Object} options.body - Request body to be validated
 * @returns {Object} - Returns the validated request body value
 * @throws {Error} - Throws an error if the request body validation fails
 */
function validateRequestBody({ body }) {
  try {
    // Validate the request body against the defined schema
    const { error, value } = helperValidatorsApiScrapeStart.validate(body, {
      abortEarly: false
    });

    // Return validation errors if request is invalid
    if (error) {
      throw new Error(error);
    }

    return value; // Return the validated request body
  } catch (error) {
    error.code = 'ERROR_REQUEST_BODY_VALIDATION';
    error.status = 400;
    throw error;
  }
}
