// Node modules
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
app.use(helmet());

// Middleware to enable CORS
app.use(cors({
    origin: '*', // Allow all origins for simplicity; adjust as needed
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// JSON parsing middleware
app.use(express.json({ limit: '50mb' }));

// Apply all routes
app.use(routes);

// Export the app for use in other modules
export default app;