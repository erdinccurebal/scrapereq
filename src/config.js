/**
 * Configuration Module
 *
 * Central configuration for the application.
 * Loads environment variables and provides defaults.
 */

import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Envronment variables
const {
  PORT,
  HOST,
  NODE_ENV,
  WEB_ADDRESS,
  AUTH_USERNAME,
  AUTH_PASSWORD,
  ACCESS_PASSWORD_WITHOUT_PROXY,
  TMP_DIR,
  RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_MAX_REQUESTS
} = process.env;

// System configuration
export const config = {
  // Server settings
  server: {
    port: PORT || 3000,
    host: HOST || 'localhost',
    env: NODE_ENV || 'development',
    webAddress: WEB_ADDRESS || `http://${HOST || 'localhost'}:${PORT || 3000}`
  },

  // Authentication settings
  auth: {
    username: AUTH_USERNAME || 'admin',
    password: AUTH_PASSWORD || 'admin',
    accessPasswordWithoutProxy: ACCESS_PASSWORD_WITHOUT_PROXY || null
  },

  // File system settings
  paths: {
    tmp: TMP_DIR || './tmp'
  },

  // Rate limiter settings
  rateLimit: {
    windowMs: parseInt(RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    maxRequests: parseInt(RATE_LIMIT_MAX_REQUESTS) || 100 // Limit each IP to 100 requests per windowMs
  }
};
