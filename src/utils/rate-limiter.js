/**
 * Rate Limiter Configuration Utility
 * 
 * This file provides rate limiting functionality for the application.
 * Rate limiting helps protect the API from abuse by limiting the number of
 * requests a client can make in a given time period.
 */

// Node third-party modules
import rateLimit from 'express-rate-limit'

// Import central configuration module
import { config } from '../config.js'

/**
 * Configure and return the rate limiter middleware with application-specific settings
 * @returns {Function} Configured rate limiter middleware
 */
export function setupRateLimiter() {
  return rateLimit({
    windowMs: config.rateLimit.windowMs, // Request window (e.g., 15 minutes)
    max: config.rateLimit.maxRequests, // Maximum number of requests allowed within this period
    message: {
      success: false,
      data: {
        message: 'Too many requests made, please try again later',
        code: 'ERROR_RATE_LIMIT_EXCEEDED'
      }
    }
  })
}