/**
 * Routes Configuration
 * Centralizes all route definitions for the application
 */

// Import Express framework for routing
import express from 'express';
// Import basic authentication middleware
import basicAuth from 'express-basic-auth';

// Controller imports
import controllerScraper from './controllers/scraper.js';
import controllerHealth from './controllers/health.js';
import controllerRouteNotFoundHandler from './controllers/route-not-found-handler.js';
import controllerErrorHandler from './controllers/error-handler.js';

// Initialize Express Router
const router = express.Router();

// Basic auth middleware - Secures all routes with username/password authentication
// Uses environment variables or defaults to 'admin'/'admin' if not set
router.use(basicAuth({
    users: {
        [process.env.AUTH_USERNAME || 'admin']: process.env.AUTH_PASSWORD || 'admin'
    }
}));

// Health check route - Endpoint to verify API is operational
router.get('/health', controllerHealth);

// Scraper route - POST method for scraping requests
// Main endpoint for web scraping functionality
router.post('/', controllerScraper);

// 404 handler for undefined routes
// Catches any requests to paths not defined above
router.use(controllerRouteNotFoundHandler);

// Error handling middleware
// Centralized error handling for the entire application
router.use(controllerErrorHandler);

// Export the router for use in the main application
export default router;