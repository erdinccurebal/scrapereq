/**
 * Basic Authentication Utility
 *
 * Provides Express basic authentication configuration for securing API routes.
 * Implements username/password protection for sensitive operations.
 *
 * @module utils/basic-auth
 */

// Third-party modules
import basicAuth from 'express-basic-auth';

// Application constants
import { AUTH_DEFAULTS } from '../constants.js';

/**
 * Applies basic authentication to an Express router
 *
 * Secures all routes under the router with username/password authentication.
 * Uses credentials from environment variables or falls back to defaults from constants.
 *
 * @param {Object} router - Express router instance to secure
 * @throws {Error} When router parameter is missing or invalid
 */
export function setupBasicAuth(router) {
  if (!router) {
    throw new Error('Express router instance is required for authentication setup');
  }

  // Apply basic authentication middleware to all routes
  router.use(
    basicAuth({
      users: {
        [process.env.AUTH_USERNAME || AUTH_DEFAULTS.USERNAME]:
          process.env.AUTH_PASSWORD || AUTH_DEFAULTS.PASSWORD
      },
      challenge: true, // Display browser authentication prompt
      unauthorizedResponse: 'Authentication required to access the API'
    })
  );
}
