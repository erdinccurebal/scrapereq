/**
 * HTTP Request Logger Utility
 *
 * Configures Morgan HTTP request logging middleware with environment-specific settings.
 * Provides different logging formats for development and production environments.
 *
 * @module utils/logger
 */

// Third-party modules
import morgan from 'morgan';

// Application configuration
import { config } from '../config.js';

// Application constants
import { LOGGER_CONFIG } from '../constants.js';

/**
 * Creates and returns configured HTTP request logging middleware
 *
 * Uses different logging formats based on the environment:
 * - Development: Colored, concise output for better readability
 * - Production: Detailed Apache-style logs for analytics and troubleshooting
 *
 * Automatically excludes health checks and favicon requests to reduce noise.
 *
 * @returns {Function} Configured Morgan middleware
 */
export function setupLogger() {
  // Select format based on environment
  const format =
    config.server.env === 'production'
      ? LOGGER_CONFIG.FORMATS.PRODUCTION // Apache combined format for production
      : LOGGER_CONFIG.FORMATS.DEVELOPMENT; // Developer-friendly colored format

  // Configure and return Morgan middleware
  return morgan(format, {
    // Skip logging for health endpoint and favicon requests to reduce log noise
    skip: LOGGER_CONFIG.OPTIONS.SKIP_HEALTH_AND_FAVICON
  });
}
