/**
 * Logger Utility
 * 
 * This file provides logger configuration and setup for the application.
 * It centralizes all logging-related functionality in one place.
 */

// Node third-party modules
import morgan from 'morgan'

// Import central configuration
import { config } from '../config.js'

/**
 * Configure and return the morgan HTTP logger middleware with environment-specific settings
 * @returns {Function} Configured morgan middleware
 */
export function setupLogger() {
    // Determine format based on environment
    const morganFormat = config.server.env === 'production'
        ? 'combined' // More detailed logging for production
        : 'dev'      // More colorful and concise for development

    // Determine skip option - Skip logging health check endpoints in production
    const skipOption = (req, _res) => {
        if (config.server.env === 'production') {
            return req.originalUrl.includes('/health')
        }
        return false
    }

    // Return configured morgan middleware
    return morgan(morganFormat, { skip: skipOption })
}