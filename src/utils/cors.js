/**
 * CORS Configuration Utility
 * 
 * This file provides CORS (Cross-Origin Resource Sharing) configuration for the application.
 * It centralizes all CORS-related functionality in one place and offers a clean API.
 */

// Node third-party modules
import cors from 'cors';

// Import constants
import { API_CONFIG } from '../constants.js';

/**
 * Configure and return the CORS middleware with application-specific settings
 * @returns {Function} Configured CORS middleware
 */
export function setupCors() {
    // Return configured CORS middleware using settings from API_CONFIG
    return cors({
        origin: API_CONFIG.CORS.ORIGIN,
        methods: API_CONFIG.CORS.METHODS,
        allowedHeaders: API_CONFIG.CORS.ALLOWED_HEADERS
    });
};