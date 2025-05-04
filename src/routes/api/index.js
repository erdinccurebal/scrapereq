// Node third-party modules
import express from 'express';

// Import Swagger setup
import { setupSwagger } from '../../utils/swagger.js';
import { setupTmp } from '../../utils/tmp.js';
import { setupBasicAuth } from '../../utils/basic-auth.js';

// Controllers imports
import { controllerApiIndex } from '../../controllers/api/index.js';

// Routes imports
import { routerApiScrape } from './scrape.js';
import { routerApiOs } from './os.js';
import { routerApiApp } from './app.js';

// Initialize Express Router
const router = express.Router();

/**
 * Set up Swagger API documentation
 * Makes API documentation available at /api/docs
 * This should be done before applying routes to ensure proper documentation
 */
setupSwagger(router);

/**
 * Serve static files from tmp directory
 * This allows accessing screenshots via HTTP requests
 */
setupTmp(router);

// Define API index route
router.get('/', controllerApiIndex);

// Basic auth middleware - Secures all routes with username/password authentication
// Uses environment variables or defaults to defined constants if not set
setupBasicAuth(router);

// Define API routes
router.use('/scrape', routerApiScrape);
router.use('/app', routerApiApp);
router.use('/os', routerApiOs);

// Export the router for use in the application
export const routerApi = router;
