/**
 * JSON Parser Configuration Utility
 * 
 * This file provides JSON parsing middleware configuration for the application.
 * It centralizes all JSON-related parsing settings in one place.
 */

// Node third-party modules
import express from 'express'

// Import central configuration
import { config } from '../config.js'

/**
 * Configure and return the JSON parsing middleware with application-specific settings
 * @returns {Function} Configured JSON parsing middleware
 */
export function setupJsonParser() {
  // Return express.json middleware with a reasonable size limit
  return express.json({ 
    limit: '10mb' // Limit JSON payload size to prevent abuse
  })
}