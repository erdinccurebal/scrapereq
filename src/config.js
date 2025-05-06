/**
 * Configuration Module
 *
 * Central configuration for the application that provides a unified interface
 * for all application settings. Loads environment variables from .env file
 * and provides sensible defaults when variables are not defined.
 */

import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Environment variables with destructuring
const {
  PORT,
  HOST,
  NODE_ENV,
  WEB_ADDRESS,
  AUTH_USERNAME,
  AUTH_PASSWORD,
  TMP_DIR,
  RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_MAX_REQUESTS
} = process.env;

// System configuration with defaults
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
    password: AUTH_PASSWORD || 'admin'
  },

  // File system settings
  paths: {
    tmp: TMP_DIR || './tmp'
  },

  // Rate limiter settings
  rateLimit: {
    windowMs: Number(RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    maxRequests: Number(RATE_LIMIT_MAX_REQUESTS) || 100 // Limit each IP to 100 requests per windowMs
  }
};
