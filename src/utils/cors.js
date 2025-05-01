/**
 * CORS Configuration Utility
 * 
 * This file provides CORS (Cross-Origin Resource Sharing) configuration for the application.
 * It centralizes all CORS-related functionality in one place and offers a clean API.
 */

// Node third-party modules
import cors from 'cors'

// Import central configuration
import { config } from '../config.js'

/**
 * Configure and return the CORS middleware with application-specific settings
 * @returns {Function} Configured CORS middleware
 */
export function setupCors() {
  // Return configured CORS middleware
  return cors({
    origin: '*', // Allow all origins by default, could be restricted from config
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
}