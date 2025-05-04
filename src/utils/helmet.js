/**
 * Helmet Security Configuration Utility
 *
 * This file provides Helmet security middleware configuration for the application.
 * Helmet helps secure Express apps by setting various HTTP headers to protect against common web vulnerabilities.
 */

// Node third-party modules
import helmet from 'helmet';

// Import central configuration and constants
import { config } from '../config.js';
import { HELMET_CONFIG } from '../constants.js';

/**
 * Configure and return the Helmet middleware with application-specific security settings
 * @returns {Function} Configured Helmet middleware
 */
export function setupHelmet() {
  // Return helmet configuration appropriate for the environment
  if (config.server.env === 'production') {
    // Enhanced security settings for production
    return helmet(HELMET_CONFIG.PRODUCTION);
  }

  // Basic configuration for development
  return helmet(HELMET_CONFIG.DEVELOPMENT);
}
