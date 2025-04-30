/**
 * JSON Parser Configuration Utility
 * 
 * This file provides JSON parsing middleware configuration for the application.
 * It centralizes all JSON-related parsing settings in one place.
 */

// Node third-party modules
import express from 'express';

// Import constants
import { API_CONFIG } from '../constants.js';

/**
 * Configure and return the JSON parsing middleware with application-specific settings
 * @returns {Function} Configured JSON parsing middleware
 */
export function setupJsonParser() {
    // Return express.json middleware with configured limit from API_CONFIG
    return express.json({ limit: API_CONFIG.JSON_LIMIT });
};