// Node third-party modules
import express from 'express';

// Utility imports for API setup
import { setupSwagger } from '../../utils/swagger.js';
import { setupTmp } from '../../utils/tmp.js';
import { setupBasicAuth } from '../../utils/basic-auth.js';

// Controllers import
import { controllerApiIndex } from '../../controllers/api/index.js';

// Route imports
import { routerApiScrape } from './scrape.js';
import { routerApiOs } from './os.js';
import { routerApiApp } from './app.js';

// Initialize Express Router
const router = express.Router();

/**
 * Set up Swagger API documentation
 * Makes API documentation available at /api/docs
 * This must be done before applying routes for proper documentation generation
 */
setupSwagger(router);

/**
 * Serve static files from tmp directory
 * Enables HTTP access to screenshots and other temporary files
 */
setupTmp(router);

// Define API index route
router.get('/', controllerApiIndex);

/**
 * Apply basic authentication middleware
 * Secures all routes with username/password authentication
 * Uses environment variables or falls back to constants if not set
 */
setupBasicAuth(router);

// Register API route modules
router.use('/scrape', routerApiScrape);
router.use('/app', routerApiApp);
router.use('/os', routerApiOs);

// Export the router for use in the application
export const routerApi = router;
