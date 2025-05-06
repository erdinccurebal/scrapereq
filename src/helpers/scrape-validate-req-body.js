// Helpers
import { helperValidatorsApiScrape } from './validators.js';

/**
 * Validates the request body against the defined schema
 *
 * @param {Object} options - Options object
 * @param {Object} options.body - Request body to be validated
 * @returns {Object} - Returns the validated request body value
 * @throws {Error} - Throws an error if the request body validation fails
 */
export function helperScrapeValidateRequestBody({ body }) {
  try {
    // Validate the request body against the defined schema
    const { error, value } = helperValidatorsApiScrape.validate(body, {
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
