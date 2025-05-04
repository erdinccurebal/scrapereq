// Node third-party modules
import basicAuth from 'express-basic-auth';

// Import constants
import { AUTH_DEFAULTS } from '../constants.js';

export function setupBasicAuth(router) {
  if (!router) {
    throw new Error('Express router instance is required');
  }

  // Apply basic authentication to all routes
  router.use(
    basicAuth({
      users: {
        [process.env.AUTH_USERNAME || AUTH_DEFAULTS.USERNAME]:
          process.env.AUTH_PASSWORD || AUTH_DEFAULTS.PASSWORD
      }
    })
  );
}
