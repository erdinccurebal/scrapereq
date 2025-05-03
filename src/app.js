/**
 * Main Application Setup
 * 
 * This file configures the Express application with necessary middleware,
 * routes, and error handlers. It serves as the central configuration point
 * for the web application.
 */

// Node third-party modules
import express from 'express';

// Import configuration
import { config } from './config.js';

// Import centralized routes
import { routerParent } from './routes/index.js';

// Import utilities
import { setupLogger } from './utils/logger.js';
import { setupCors } from './utils/cors.js';
import { setupHelmet } from './utils/helmet.js';
import { setupJsonParser } from './utils/json-parser.js';
import { setupRateLimiter } from './utils/rate-limiter.js';

/**
 * Initialize Express application
 * This creates the main application instance
 */
const app = express();

// Hide Express information - Remove X-Powered-By header for security
app.disable('x-powered-by');

// Store configuration in app locals for access throughout the application
app.locals.config = config;

/**
 * Use Helmet to customize HTTP headers for enhanced security
 * Helps protect against common web vulnerabilities including:
 * - XSS attacks
 * - Content Type sniffing
 * - Clickjacking
 * This should be one of the first middleware to ensure all responses have proper security headers
 */
app.use(setupHelmet());

/**
 * Middleware to enable CORS (Cross-Origin Resource Sharing)
 * Controls which domains can access the API
 * Configuration is loaded from utils/cors module
 * Should be applied early in the middleware chain
 */
app.use(setupCors());

/**
 * Set up and apply HTTP request logging middleware
 * Logger configuration is loaded from utils/logger module
 * Applied early to log all incoming requests including those that might be rate-limited
 */
app.use(setupLogger());

/**
 * Apply rate limiting middleware to prevent abuse
 * Configuration is loaded from utils/rate-limiter module
 * Applied before parsing to avoid wasting resources on parsing requests that exceed rate limits
 */
app.use(setupRateLimiter());

/**
 * JSON parsing middleware - Process request bodies as JSON
 * Sets a limit to handle large payloads
 * The limit is defined in API_CONFIG constants and configured in utils/json-parser module
 * Applied after rate limiting but before routes to ensure all route handlers have parsed JSON available
 */
app.use(setupJsonParser());


/**
 * Apply all routes defined in the routes.js file
 * This mounts all application routes under their respective paths
 * Applied last after all preprocessing middleware
 */
app.use(routerParent);

// Export the app for use in other modules
export const expressApp = app;