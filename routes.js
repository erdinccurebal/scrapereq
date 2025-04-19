/**
 * Routes Configuration
 * Centralizes all route definitions for the application
 */

import express from 'express';
import basicAuth from 'express-basic-auth';

// Controller imports
import controllerScraper from './controllers/scraper.js';
import controllerHealth from './controllers/health.js';
import controllerRouteNotFoundHandler from './controllers/route-not-found-handler.js';
import controllerErrorHandler from './controllers/error-handler.js';

const router = express.Router();

// Basic auth middleware
router.use(basicAuth({
    users: {
        [process.env.AUTH_USERNAME || 'admin']: process.env.AUTH_PASSWORD || 'admin'
    }
}));

// Health check route
router.get('/health', controllerHealth);

// Scraper route - POST method for scraping requests
router.post('/', controllerScraper);

// 404 handler for undefined routes
router.use(controllerRouteNotFoundHandler);

// Error handling middleware
router.use(controllerErrorHandler);

export default router;