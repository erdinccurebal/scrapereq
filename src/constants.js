/**
 * Application Constants
 * 
 * This file defines constants used throughout the application
 */

/**
 * Scraper Speed Modes
 * 
 * TURBO: No delay between steps - fastest mode
 * FAST: Minimal delay for quick scraping
 * NORMAL: Moderate delay for balanced scraping
 * SLOW: Medium delay to reduce detection risk
 * SLOWEST: Significant delay for careful scraping
 * CRAWL: Very slow speed like crawling
 * STEALTH: Maximum delay for absolute stealth
 */
export const SPEED_MODES = {
  TURBO: 0,      // 0ms delay between steps
  FAST: 500,     // 500ms delay between steps
  NORMAL: 1000,  // 1000ms (1 second) delay between steps
  SLOW: 1500,    // 1500ms (1.5 seconds) delay between steps
  SLOWEST: 2000, // 2000ms (2 seconds) delay between steps
  CRAWL: 2500,   // 2500ms (2.5 seconds) delay between steps
  STEALTH: 3000  // 3000ms (3 seconds) delay between steps
};

/**
 * Speed Mode Names as Enum
 */
export const SPEED_MODE_NAMES = {
  TURBO: 'TURBO',
  FAST: 'FAST',
  NORMAL: 'NORMAL',
  SLOW: 'SLOW',
  SLOWEST: 'SLOWEST',
  CRAWL: 'CRAWL',
  STEALTH: 'STEALTH'
};

/**
 * Default speed mode if none is specified
 */
export const DEFAULT_SPEED_MODE = 'NORMAL';

/**
 * Timeout Configuration
 * 
 * SHORT: 10 seconds for shorter operations
 * NORMAL: 30 seconds default timeout
 * LONG: 60 seconds for longer operations
 */
export const TIMEOUT_MODES = {
  SHORT: 10000,      // 10 seconds for shorter operations
  NORMAL: 30000,    // 30 seconds default timeout
  LONG: 60000,       // 60 seconds for longer operations
};

/**
 * Timeout Mode Names as Enum
 */
export const TIMEOUT_MODE_NAMES = {
  SHORT: 'SHORT',
  NORMAL: 'NORMAL',
  LONG: 'LONG',
};

/**
 * Default timeout mode if none is specified
 */
export const DEFAULT_TIMEOUT_MODE = 'NORMAL';

/**
 * Response Types
 * 
 * NONE: No response expected
 * JSON: JSON response expected
 * RAW: Raw response expected
 */
export const RESPONSE_TYPE_NAMES = {
  NONE: 'NONE',
  JSON: 'JSON',
  RAW: 'RAW',
};

/**
 * Default response type if none is specified
 */
export const DEFAULT_RESPONSE_TYPE = 'NONE';

/**
 * Selector Types
 * 
 * CSS: CSS selector type
 * XPATH: XPath selector type
 * FULL: Full selector type
 */
export const SELECTOR_TYPE_NAMES = {
  CSS: 'CSS',
  XPATH: 'XPATH',
  FULL: 'FULL',
};

// Headless mode configuration
// In development mode, headless mode is disabled for debugging purposes
// In production mode, headless mode is enabled for performance
const HEADLESS = process.env.NODE_ENV === 'development' ? false : true;

/**
 * Browser Configuration
 * 
 * HEADLESS: Whether the browser runs in headless mode
 * USER_AGENT: The user agent string for the browser
 * ACCEPT_LANGUAGE: Language preferences for the browser
 * ARGS: Additional arguments for browser configuration
 */
export const BROWSER_CONFIG = {
  HEADLESS,
  USER_AGENT: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  ACCEPT_LANGUAGE: 'en-US,en;q=0.9',
  ARGS: {
    NO_SANDBOX: '--no-sandbox',
    DISABLE_SETUID_SANDBOX: '--disable-setuid-sandbox',
    DISABLE_WEB_SECURITY: '--disable-web-security'
  }
};

/**
 * API Configuration
 * 
 * JSON_LIMIT: Maximum size for JSON payloads
 * CORS: Cross-Origin Resource Sharing settings
 */
export const API_CONFIG = {
  JSON_LIMIT: '50mb',
  CORS: {
    ORIGIN: '*',
    METHODS: ['GET', 'POST'],
    ALLOWED_HEADERS: ['Content-Type', 'Authorization']
  }
};

/**
 * Authentication Defaults
 * 
 * USERNAME: Default username for authentication
 * PASSWORD: Default password for authentication
 */
export const AUTH_DEFAULTS = {
  USERNAME: 'admin',
  PASSWORD: 'admin'
};

/**
 * Step Types for Scraper
 * 
 * NAVIGATE: Navigate to a URL
 * CLICK: Perform a click action
 * WAIT: Wait for a specified duration
 * SET_VIEWPORT: Set the browser viewport size
 * CHANGE: Change the value of an input element
 * WAIT_FOR_ELEMENT: Wait for a specific element to appear on the page
 */
export const STEP_TYPES = {
  NAVIGATE: 'navigate',
  CLICK: 'click',
  WAIT: 'wait',
  SET_VIEWPORT: 'setViewport',
  CHANGE: 'change',
  WAIT_FOR_ELEMENT: 'waitForElement'
};

/**
 * Proxy Protocol Types
 * 
 * HTTP: HTTP protocol for proxy
 * HTTPS: HTTPS protocol for proxy
 * SOCKS4: SOCKS4 protocol for proxy
 * SOCKS5: SOCKS5 protocol for proxy
 */
export const PROXY_PROTOCOLS = {
  HTTP: 'http',
  HTTPS: 'https',
  SOCKS4: 'socks4',
  SOCKS5: 'socks5'
};

/**
 * Logging Configuration
 * 
 * FORMATS: Different log formats for different environments
 * OPTIONS: Additional options for morgan logger
 */
export const LOGGER_CONFIG = {
  FORMATS: {
    DEVELOPMENT: 'dev',           // Concise colored output for development
    PRODUCTION: 'combined',       // Apache-style logging for production
    SHORT: 'short',               // Shorter than default, includes response time
    TINY: 'tiny',                 // Minimal output
    CUSTOM: ':method :url :status :res[content-length] - :response-time ms'  // Example custom format
  },
  OPTIONS: {
    SKIP_HEALTH: (req) => req.url.includes('/health'), // Skip logging health check requests
    SKIP_NONE: () => false,                            // Log all requests
  }
};

/**
 * Health Check Configuration
 * 
 * Settings for health check operations
 */
export const HEALTH_CHECK_CONFIG = {
  TIMEOUT: TIMEOUT_MODES.NORMAL,  // 30 seconds timeout for health check operations
  TEST_URL: 'https://www.google.com', // URL to test puppeteer functionality
  HEADLESS: HEADLESS  // Run health check browser in headless mode
};

/**
 * Rate Limiter Configuration
 * 
 * WINDOW_MS: Time window for rate limiting in milliseconds
 * MAX_REQUESTS: Maximum number of requests allowed per IP in the time window
 * MESSAGE: Message to send when rate limit is exceeded
 */
export const RATE_LIMITER_CONFIG = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100, // limit each IP to 100 requests per windowMs
  MESSAGE: 'Too many requests from this IP, please try again later'
};

/**
 * Swagger Documentation Configuration
 * 
 * Settings for API documentation
 */
export const SWAGGER_CONFIG = {
  OPENAPI_VERSION: '3.0.0',
  INFO: {
    TITLE: 'Scrapereq',
    VERSION: '1.0.0',
    DESCRIPTION: 'Web scraping API using puppeteer.',
    CONTACT: {
      NAME: 'API Support'
    },
    LICENSE: {
      NAME: 'ISC'
    }
  },
  SECURITY_SCHEMES: {
    BASIC_AUTH: {
      TYPE: 'http',
      SCHEME: 'basic'
    }
  },
  SERVERS: {
    URL: process.env.WEB_ADDRESS || 'http://localhost:3000',
    DESCRIPTION: 'API ADDRESS'
  }
};
