/**
 * Rate Limiter Configuration
 *
 * Configures and exports an Express rate limiter middleware to protect the API
 * from excessive requests. This helps prevent abuse and ensures service availability.
 *
 * The rate limiter tracks requests by IP address and applies configured limits
 * from application settings.
 */

// Third-party dependencies
import rateLimit from 'express-rate-limit';

// Application configuration
import { config } from '../config.js';

// Rate limiter specific constants
import { RATE_LIMITER_CONFIG } from '../constants.js';

/**
 * Creates and configures a rate limiter middleware instance
 *
 * @returns {Function} Configured Express rate limiter middleware
 */
export function setupRateLimiter() {
  return rateLimit({
    windowMs: config.rateLimit.windowMs, // Time window for tracking requests
    max: config.rateLimit.maxRequests, // Maximum requests per window per IP
    message: RATE_LIMITER_CONFIG.ERROR_MESSAGE,
    standardHeaders: RATE_LIMITER_CONFIG.STANDARD_HEADERS, // Return rate limit info in standard headers
    legacyHeaders: RATE_LIMITER_CONFIG.LEGACY_HEADERS // Disable the `X-RateLimit-*` headers
  });
}
