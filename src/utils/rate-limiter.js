/**
 * Rate Limiter Configuration Utility
 * 
 * This file provides rate limiting functionality for the application.
 * Rate limiting helps protect the API from abuse by limiting the number of
 * requests a client can make in a given time period.
 */

// Node third-party modules
import rateLimit from 'express-rate-limit';

// Application constants
import { RATE_LIMITER_CONFIG } from '../constants.js';

/**
 * Configure and return the rate limiter middleware with application-specific settings
 * @returns {Function} Configured rate limiter middleware
 */
export function setupRateLimiter() {
    return rateLimit({
        windowMs: RATE_LIMITER_CONFIG.WINDOW_MS,
        max: RATE_LIMITER_CONFIG.MAX_REQUESTS,
        message: RATE_LIMITER_CONFIG.MESSAGE
    });
};