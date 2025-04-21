// filepath: c:\Users\EC\Develop\req-scrap\app.js
// Node modules - Express framework and security middleware packages
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Import centralized routes
import routes from './routes.js';

// Import constants
import { API_CONFIG, LOGGER_CONFIG } from './constants.js';

// Import Swagger setup
import { swaggerDocs, swaggerUi } from './swagger.js';

// Controller imports
import controllerRouteNotFoundHandler from './controllers/route-not-found-handler.js';
import controllerErrorHandler from './controllers/error-handler.js';

// Get directory name in ES module context
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Define tmp directory path, using env variable or default to local path
const TMP_DIR = process.env.TMP_DIR || path.join(__dirname, 'tmp');

// Ensure tmp directory exists
if (!fs.existsSync(TMP_DIR)) {
    try {
        fs.mkdirSync(TMP_DIR, { recursive: true });
        console.log(`Created TMP_DIR at: ${TMP_DIR}`);
    } catch (error) {
        console.error(`Failed to create TMP_DIR at ${TMP_DIR}:`, error);
    }
}

// Initialize Express application
const app = express();

// Hide Express information - Remove X-Powered-By header for security
app.disable('x-powered-by');

// Use Helmet to customize HTTP headers for enhanced security
// Helps protect against common web vulnerabilities
app.use(helmet());

// Middleware to enable CORS (Cross-Origin Resource Sharing)
// Controls which domains can access the API
app.use(cors({
    origin: API_CONFIG.CORS.ORIGIN,
    methods: API_CONFIG.CORS.METHODS,
    allowedHeaders: API_CONFIG.CORS.ALLOWED_HEADERS
}));

// HTTP request logger middleware with environment-specific format
// Skip health check requests in production mode
const morganFormat = process.env.NODE_ENV === 'production'
    ? LOGGER_CONFIG.FORMATS.PRODUCTION
    : LOGGER_CONFIG.FORMATS.DEVELOPMENT;
const skipOption = process.env.NODE_ENV === 'production'
    ? LOGGER_CONFIG.OPTIONS.SKIP_HEALTH
    : LOGGER_CONFIG.OPTIONS.SKIP_NONE;
app.use(morgan(morganFormat, { skip: skipOption }));

// JSON parsing middleware - Process request bodies as JSON
// Sets a limit to handle large payloads
app.use(express.json({ limit: API_CONFIG.JSON_LIMIT }));

// Serve static files from tmp directory (configured via TMP_DIR env variable)
app.use('/tmp', express.static(TMP_DIR));

// Make TMP_DIR available to routes via app.locals
app.locals.TMP_DIR = TMP_DIR;

// Set up Swagger documentation
app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocs, {
        explorer: true,
        customCss: '.swagger-ui .topbar { display: none }',
    })
);

// Apply all routes defined in the routes.js file
app.use(routes);

// 404 handler for undefined routes
// Catches any requests to paths not defined above
app.use(controllerRouteNotFoundHandler);

// Error handling middleware
// Centralized error handling for the entire application
app.use(controllerErrorHandler);

// Export the app for use in other modules
export default app;