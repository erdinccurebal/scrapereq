/**
 * Logger Utility
 * 
 * This file provides logger configuration and setup for the application.
 * It centralizes all logging-related functionality in one place.
 */

// Node third-party modules
import morgan from 'morgan';

// Import constants
import { LOGGER_CONFIG } from '../constants.js';

/**
 * Configure and return the morgan HTTP logger middleware with environment-specific settings
 * @returns {Function} Configured morgan middleware
 */
export function setupLogger() {
    // Determine format based on environment
    const morganFormat = process.env.NODE_ENV === 'production'
        ? LOGGER_CONFIG.FORMATS.PRODUCTION
        : LOGGER_CONFIG.FORMATS.DEVELOPMENT;

    // Determine skip option based on environment
    const skipOption = process.env.NODE_ENV === 'production'
        ? LOGGER_CONFIG.OPTIONS.SKIP_HEALTH
        : LOGGER_CONFIG.OPTIONS.SKIP_NONE;

    // Return configured morgan middleware
    return morgan(morganFormat, { skip: skipOption });
};