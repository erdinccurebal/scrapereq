/**
 * CORS Configuration Utility
 *
 * Configures Cross-Origin Resource Sharing (CORS) middleware for the application.
 * Enables secure cross-origin requests while protecting against unauthorized access.
 *
 * @module utils/cors
 */

// Third-party modules
import cors from 'cors';

// Application constants
import { CORS_CONFIG } from '../constants.js';

/**
 * Creates and returns configured CORS middleware
 *
 * Applies application-wide CORS settings from constants to control
 * which origins, methods, and headers are allowed for cross-origin requests.
 *
 * @returns {Function} Express middleware configured with CORS settings
 */
export function setupCors() {
  return cors({
    origin: CORS_CONFIG.ORIGIN, // Control which origins can access the API
    methods: CORS_CONFIG.METHODS, // Allowed HTTP methods
    allowedHeaders: CORS_CONFIG.ALLOWED_HEADERS, // Headers clients can send
    credentials: CORS_CONFIG.CREDENTIALS, // Allow cookies in cross-origin requests
    maxAge: CORS_CONFIG.MAX_AGE // Cache preflight requests (seconds)
  });
}
