/**
 * Main Application Setup
 *
 * This file configures the Express application with necessary middleware,
 * routes, and error handlers. It serves as the central configuration point
 * for the web API.
 */

// Third-party modules
import express from 'express';

// Configuration
import { config } from './config.js';

// Routes
import { routerParent } from './routes/index.js';

// Utilities
import { setupLogger } from './utils/logger.js';
import { setupCors } from './utils/cors.js';
import { setupHelmet } from './utils/helmet.js';
import { setupJsonParser } from './utils/json-parser.js';
import { setupRateLimiter } from './utils/rate-limiter.js';

/**
 * Initialize Express application
 */
const app = express();

// Enhance security by removing X-Powered-By header
app.disable('x-powered-by');

// Make configuration accessible throughout the application
app.locals.config = config;

/**
 * Apply middleware in strategic order:
 *
 * 1. Security middleware (helmet) - Protect against common vulnerabilities
 * 2. CORS - Handle cross-origin requests
 * 3. Logger - Log all incoming requests
 * 4. Rate limiter - Prevent abuse before processing requests
 * 5. Body parser - Parse JSON payloads after validating request limits
 * 6. Routes - Handle application endpoints
 */

// Security headers with Helmet (XSS protection, content type sniffing prevention, etc.)
app.use(setupHelmet());

// Cross-Origin Resource Sharing configuration
app.use(setupCors());

// HTTP request logging
app.use(setupLogger());

// Rate limiting to prevent API abuse
app.use(setupRateLimiter());

// JSON body parsing with size limits
app.use(setupJsonParser());

// Register all application routes
app.use(routerParent);

export const expressApp = app;
