/**
 * JSON Parser Configuration Utility
 *
 * Configures Express JSON body parsing middleware with appropriate settings.
 * Centralizes request body handling and ensures consistent payload size limits.
 *
 * @module utils/json-parser
 */

// Node third-party modules
import express from 'express';

// Application constants
import { JSON_PARSER_CONFIG } from '../constants.js';

/**
 * Creates and returns a configured JSON body parsing middleware
 *
 * Applies application-wide settings for parsing JSON request bodies,
 * with payload size limits defined in constants.
 *
 * @returns {Function} Configured express.json middleware
 */
export function setupJsonParser() {
  return express.json({
    limit: JSON_PARSER_CONFIG.JSON_LIMIT // Maximum JSON payload size (50mb)
  });
}
