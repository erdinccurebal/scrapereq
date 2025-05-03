/**
 * JSON Parser Configuration Utility
 * 
 * This file provides JSON parsing middleware configuration for the application.
 * It centralizes all JSON-related parsing settings in one place.
 */

// Node third-party modules
import express from 'express'

// Import central configuration and constants
import { JSON_PARSER_CONFIG } from '../constants.js'

/**
 * Configure and return the JSON parsing middleware with application-specific settings
 * @returns {Function} Configured JSON parsing middleware
 */
export function setupJsonParser() {
  // Return express.json middleware with configured size limit
  return express.json({ 
    limit: JSON_PARSER_CONFIG.JSON_LIMIT
  })
}