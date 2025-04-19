// filepath: c:\Users\EC\Develop\req-scrap\app.js
// Node modules - Express framework and security middleware packages
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

// Import centralized routes
import routes from './routes.js';

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
    origin: '*', // Allow all origins for simplicity; adjust as needed
    methods: ['GET', 'POST'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allowed request headers
}));

// JSON parsing middleware - Process request bodies as JSON
// Sets a 50MB limit to handle large payloads
app.use(express.json({ limit: '50mb' }));

// Apply all routes defined in the routes.js file
app.use(routes);

// Export the app for use in other modules
export default app;