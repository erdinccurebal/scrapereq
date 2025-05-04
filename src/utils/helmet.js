/**
 * Helmet Security Configuration Utility
 *
 * Configures Helmet security middleware to protect the application from common web vulnerabilities.
 * Provides environment-specific security settings with enhanced protection in production.
 *
 * @module utils/helmet
 */

// Third-party modules
import helmet from 'helmet';

// Application configuration
import { config } from '../config.js';

// Application constants
import { HELMET_CONFIG } from '../constants.js';

/**
 * Creates and returns configured Helmet middleware
 *
 * Applies different security configurations based on the current environment.
 * Production settings are more restrictive for maximum security, while
 * development settings are relaxed to facilitate debugging and testing.
 *
 * @returns {Function} Configured Helmet middleware
 */
export function setupHelmet() {
  // Apply environment-specific security configuration
  return config.server.env === 'production'
    ? helmet(HELMET_CONFIG.PRODUCTION) // Strict security for production
    : helmet(HELMET_CONFIG.DEVELOPMENT); // Relaxed settings for development
}
