/**
 * Logger Utility
 *
 * This file provides logger configuration and setup for the application.
 * It centralizes all logging-related functionality in one place.
 */

// Node third-party modules
import morgan from 'morgan';

// Import central configuration
import { config } from '../config.js';
import { LOGGER_CONFIG } from '../constants.js';

/**
 * Configure and return the morgan HTTP logger middleware with environment-specific settings
 * @returns {Function} Configured morgan middleware
 */
export function setupLogger() {
  // Determine format based on environment
  const morganFormat =
    config.server.env === 'production'
      ? LOGGER_CONFIG.FORMATS.PRODUCTION
      : LOGGER_CONFIG.FORMATS.DEVELOPMENT;

  // Return configured morgan middleware with skip function for health and favicon requests
  return morgan(morganFormat, {
    skip: LOGGER_CONFIG.OPTIONS.SKIP_HEALTH_AND_FAVICON
  });
}
