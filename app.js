// filepath: c:\Users\EC\Develop\req-scrap\app.js
// Node modules - Express framework and security middleware packages
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

// Import centralized routes
import routes from './routes.js';

// Import constants
import { API_CONFIG } from './constants.js';

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

// JSON parsing middleware - Process request bodies as JSON
// Sets a limit to handle large payloads
app.use(express.json({ limit: API_CONFIG.JSON_LIMIT }));

// Apply all routes defined in the routes.js file
app.use(routes);

// Export the app for use in other modules
export default app;