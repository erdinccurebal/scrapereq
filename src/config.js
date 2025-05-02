/**
 * Configuration Module
 * 
 * Central configuration for the application.
 * Loads environment variables and provides defaults.
 */

import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

// System configuration
export const config = {
  // Server settings
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    env: process.env.NODE_ENV || 'development',
    webAddress: process.env.WEB_ADDRESS || `http://${process.env.HOST || 'localhost'}:${process.env.PORT || 3000}`
  },
  
  // Authentication settings
  auth: {
    username: process.env.AUTH_USERNAME || 'admin',
    password: process.env.AUTH_PASSWORD || 'admin',
    accessPasswordWithoutProxy: process.env.ACCESS_PASSWORD_WITHOUT_PROXY || null
  },
  
  // Puppeteer settings
  browser: {
    headless: process.env.NODE_ENV === 'development' ? false : true,
    chromePath: process.env.CHROME_PATH || null,
    userAgent: process.env.USER_AGENT || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    acceptLanguage: process.env.ACCEPT_LANGUAGE || 'en-US,en;q=0.9'
  },
  
  // File system settings
  paths: {
    tmp: process.env.TMP_DIR || './tmp'
  },
  
  // Rate limiter settings
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100 // Limit each IP to 100 requests per windowMs
  }
}