// Node third-party modules
import express from 'express';

// Controller imports
import { controllerRouteNotFoundHandler } from '../controllers/route-not-found-handler.js';
import { controllerErrorHandler } from '../controllers/error-handler.js';
import { controllerIndex } from '../controllers/index.js';

// Express Router instance
const router = express.Router();

// Routes
import { routerApi } from './api/index.js';

// Load controller for the root path
router.get('/', controllerIndex);

// Load API routes
router.use('/api', routerApi);

/**
 * 404 handler for undefined routes
 * Catches any requests to paths not defined above
 * Returns a standardized 404 Not Found response
 */
router.use(controllerRouteNotFoundHandler);

/**
 * Error handling middleware
 * Centralized error handling for the entire application
 * Formats errors in a consistent way for API responses
 */
router.use(controllerErrorHandler);

// Export the router for use in the main application
export const routerParent = router;
