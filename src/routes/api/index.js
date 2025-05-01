/**
 * Routes Configuration
 * Centralizes all route definitions for the application
 * @swagger
 * tags:
 *   - name: Scrape
 *     description: Web scraping operations
 *   - name: App
 *     description: Application operations
 *   - name: Os
 *     description: Operating system operations
 */

// Node core modules
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Node third-party modules
import express from 'express';
import swaggerUi from 'swagger-ui-express';

// Import basic authentication middleware
import basicAuth from 'express-basic-auth';

// Controllers imports
import { controllerApiIndex } from '../../controllers/api/index.js';

// Routes imports
import { routerApiScrape } from './scrape.js';
import { routerApiOs } from './os.js';
import { routerApiApp } from './app.js';

// Import constants
import { AUTH_DEFAULTS } from '../../constants.js';

// Import Swagger setup
import { swaggerDocs } from '../../utils/swagger.js';

/**
 * Get directory name in ES module context
 * Equivalent to __dirname in CommonJS
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Define tmp directory path, using env variable or default to local path
 * This directory is used for storing screenshots and other temporary files
 */
const TMP_DIR = process.env.TMP_DIR || path.join(__dirname, '..', '..', '..', 'tmp');

// Ensure tmp directory exists
if (!fs.existsSync(TMP_DIR)) {
    try {
        fs.mkdirSync(TMP_DIR, { recursive: true });
        console.log(`Created TMP_DIR at: ${TMP_DIR}`);
    } catch (error) {
        console.error(`Failed to create TMP_DIR at ${TMP_DIR}:`, error);
    }
}

// Initialize Express Router
const router = express.Router();

/**
 * Set up Swagger documentation
 * Provides interactive API documentation at /docs endpoint
 * Configuration options hide the default Swagger UI topbar
 */
router.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocs, {
        explorer: true,
        customCss: '.swagger-ui .topbar { display: none }',
    })
);

/**
 * Serve static files from tmp directory
 * This allows accessing screenshots via HTTP requests
 */
router.use('/tmp', express.static(TMP_DIR));

// Define API index route
router.get('/', controllerApiIndex);

// Basic auth middleware - Secures all routes with username/password authentication
// Uses environment variables or defaults to defined constants if not set
router.use(basicAuth({
    users: {
        [process.env.AUTH_USERNAME || AUTH_DEFAULTS.USERNAME]: process.env.AUTH_PASSWORD || AUTH_DEFAULTS.PASSWORD
    }
}));

// Define API routes
router.use("/scrape", routerApiScrape);
router.use("/app", routerApiApp);
router.use("/os", routerApiOs);

// Export the router for use in the application
export const routerApi = router;