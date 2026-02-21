/**
 * Application Constants
 *
 * This file defines all constants used throughout the application.
 * Organized by functional category for better maintainability.
 */

// ===========================================
// Time and Duration Constants
// ===========================================
export const TIME_CONSTANTS = {
  ONE_HOUR_MS: 60 * 60 * 1000, // 1 hour in milliseconds
  FORCE_SHUTDOWN_TIMEOUT_MS: 10000, // 10 seconds for forced shutdown
  SHUTDOWN_DELAY_MS: 3000 // 3 seconds delay before application shutdown
};

/**
 * Browser Concurrency Control
 *
 * Maximum number of concurrent browser instances allowed.
 * Can be overridden with environment variable MAX_CONCURRENT_BROWSERS.
 */
export const MAX_CONCURRENT_BROWSERS = parseInt(process.env.MAX_CONCURRENT_BROWSERS, 10) || 1;

/**
 * Memory Conversion Constants
 */
export const MEMORY_CONSTANTS = {
  BYTES_TO_KB: 1024,
  BYTES_TO_MB: 1024 * 1024,
  BYTES_TO_GB: 1024 * 1024 * 1024
};

// ===========================================
// Scraper Performance Configuration
// ===========================================

/**
 * Scraper Speed Modes (in milliseconds)
 *
 * Controls delay between scraping steps for different scenarios:
 * - TURBO: No delay - fastest possible execution
 * - FAST: Minimal delay for quick scraping
 * - NORMAL: Moderate delay for balanced scraping
 * - SLOW: Medium delay to reduce detection risk
 * - SLOWEST: Significant delay for careful scraping
 * - CRAWL: Very slow speed like crawling
 * - STEALTH: Maximum delay for absolute stealth
 */
export const SPEED_MODES = {
  TURBO: 0, // 0ms - No delay
  FAST: 500, // 500ms delay
  NORMAL: 1000, // 1 second delay
  SLOW: 1500, // 1.5 seconds delay
  SLOWEST: 2000, // 2 seconds delay
  CRAWL: 2500, // 2.5 seconds delay
  STEALTH: 3000 // 3 seconds delay
};

/**
 * Speed Mode Names Enum
 */
export const SPEED_MODE_NAMES = Object.freeze({
  TURBO: 'TURBO',
  FAST: 'FAST',
  NORMAL: 'NORMAL',
  SLOW: 'SLOW',
  SLOWEST: 'SLOWEST',
  CRAWL: 'CRAWL',
  STEALTH: 'STEALTH'
});

/** Default speed mode if none specified */
export const DEFAULT_SPEED_MODE = SPEED_MODE_NAMES.NORMAL;

/* Default title for recording */
export const DEFAULT_TITLE = 'Default Title';

/**
 * Timeout Configuration (in milliseconds)
 */
export const TIMEOUT_MODES = {
  SHORT: 10000, // 10 seconds
  NORMAL: 30000, // 30 seconds
  LONG: 60000 // 60 seconds
};

/**
 * Timeout Mode Names Enum
 */
export const TIMEOUT_MODE_NAMES = Object.freeze({
  SHORT: 'SHORT',
  NORMAL: 'NORMAL',
  LONG: 'LONG'
});

/** Default timeout mode if none specified */
export const DEFAULT_TIMEOUT_MODE = TIMEOUT_MODE_NAMES.NORMAL;

// ===========================================
// Response and Data Handling
// ===========================================

/**
 * Response Type Enum
 */
export const RESPONSE_TYPE_NAMES = Object.freeze({
  NONE: 'NONE', // No response expected
  JSON: 'JSON', // JSON response expected
  RAW: 'RAW' // Raw response expected
});

/** Default response type if none specified */
export const DEFAULT_RESPONSE_TYPE = RESPONSE_TYPE_NAMES.NONE;

/**
 * Selector Types for DOM Element Selection
 */
export const SELECTOR_TYPE_NAMES = Object.freeze({
  CSS: 'CSS', // CSS selector
  XPATH: 'XPATH', // XPath selector
  FULL: 'FULL' // Full selector
});

// ===========================================
// Browser Configuration
// ===========================================

// Determine headless mode based on environment
// In development, show browser UI for easier debugging
// In production, use 'new' headless mode for better performance
const HEADLESS = process.env.NODE_ENV === 'development' ? false : 'new';

/**
 * Browser Configuration
 */
export const BROWSER_CONFIG = {
  HEADLESS,
  USER_AGENT:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  ACCEPT_LANGUAGE: 'en-US,en;q=0.9',
  ARGS: {
    NO_SANDBOX: '--no-sandbox',
    DISABLE_SETUID_SANDBOX: '--disable-setuid-sandbox',
    DISABLE_WEB_SECURITY: '--disable-web-security',
    DISABLE_DEV_SHM_USAGE: '--disable-dev-shm-usage',
    JS_FLAGS: '--js-flags=--expose-gc',
    DISABLE_EXTENSIONS: '--disable-extensions',
    DISABLE_GPU: '--disable-gpu'
  }
};

// ===========================================
// API and Server Configuration
// ===========================================

/**
 * JSON Parser Configuration
 */
export const JSON_PARSER_CONFIG = {
  JSON_LIMIT: '50mb' // Maximum size for JSON payloads
};

/**
 * CORS Configuration
 */
export const CORS_CONFIG = {
  ORIGIN: '*',
  METHODS: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  ALLOWED_HEADERS: ['Content-Type', 'Authorization'],
  CREDENTIALS: true,
  MAX_AGE: 86400 // Cache preflight requests for 24 hours
};

/**
 * API Configuration
 */
export const API_CONFIG = {
  PORT: process.env.PORT || 3000,
  HOST: process.env.HOST || '0.0.0.0',
  BASE_PATH: '/api/v1',
  VERSION: '1.0.0'
};

/**
 * Authentication Defaults
 */
export const AUTH_DEFAULTS = {
  USERNAME: process.env.AUTH_USERNAME || 'admin',
  PASSWORD: process.env.AUTH_PASSWORD || 'admin',
  CHALLENGE: true // Display browser authentication prompt
};

// ===========================================
// Scraper Operation Constants
// ===========================================

/**
 * Step Types for Scraper Operations
 */
export const STEP_TYPES = Object.freeze({
  NAVIGATE: 'navigate', // Navigate to a URL
  CLICK: 'click', // Perform a click action
  WAIT: 'wait', // Wait for a specified duration
  SET_VIEWPORT: 'setViewport', // Set the browser viewport size
  CHANGE: 'change', // Change the value of an input element
  WAIT_FOR_ELEMENT: 'waitForElement' // Wait for element to appear
});

/**
 * Proxy Protocol Types
 */
export const PROXY_PROTOCOLS = Object.freeze({
  HTTP: 'http',
  HTTPS: 'https',
  SOCKS4: 'socks4',
  SOCKS5: 'socks5'
});

// ===========================================
// Logging and Monitoring
// ===========================================

/**
 * Logging Configuration
 */
export const LOGGER_CONFIG = {
  FORMATS: {
    DEVELOPMENT: 'dev', // Concise colored output
    PRODUCTION: 'combined', // Apache-style logging
    SHORT: 'short', // Shorter than default, with response time
    TINY: 'tiny', // Minimal output
    CUSTOM: ':method :url :status :res[content-length] - :response-time ms'
  },
  OPTIONS: {
    SKIP_HEALTH: (req) => req.url.includes('/health'),
    SKIP_FAVICON: (req) => req.url.includes('/favicon.ico'),
    SKIP_HEALTH_AND_FAVICON: (req) =>
      req.url.includes('/health') || req.url.includes('/favicon.ico'),
    SKIP_NONE: () => false // Log all requests
  }
};

/**
 * Health Check Configuration
 */
export const HEALTH_CHECK_CONFIG = {
  TIMEOUT: TIMEOUT_MODES.NORMAL,
  TEST_URL: 'https://www.google.com', // URL to test puppeteer functionality
  HEADLESS
};

// ===========================================
// Security and Rate Limiting
// ===========================================

/**
 * Rate Limiter Configuration
 */
export const RATE_LIMITER_CONFIG = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100, // 100 requests per window
  ERROR_MESSAGE: {
    success: false,
    data: {
      message: 'Too many requests made, please try again later',
      code: 'ERROR_RATE_LIMIT_EXCEEDED'
    }
  },
  STANDARD_HEADERS: true, // Return rate limit info in standard headers
  LEGACY_HEADERS: false // Disable the `X-RateLimit-*` headers
};

/**
 * Swagger Documentation Configuration
 */
export const SWAGGER_CONFIG = {
  OPENAPI_VERSION: '3.0.0',
  INFO: {
    TITLE: 'Scrapereq',
    VERSION: '1.0.0',
    DESCRIPTION: 'Web scraping API using puppeteer for automated web data extraction.',
    CONTACT: {
      NAME: 'API Support',
      EMAIL: 'erdinc@curebal.dev',
      URL: 'https://erdinc.curebal.dev'
    },
    LICENSE: {
      NAME: 'ISC',
      URL: 'https://opensource.org/licenses/ISC'
    }
  },
  SECURITY_SCHEMES: {
    BASIC_AUTH: {
      TYPE: 'http',
      SCHEME: 'basic',
      DESCRIPTION: 'Basic authentication using username and password'
    }
  },
  SERVERS: [
    {
      URL: process.env.WEB_ADDRESS || 'http://localhost:3000',
      DESCRIPTION: 'API Server'
    }
  ],
  OPTIONS: {
    EXPLORER: true,
    CUSTOM_CSS: '.swagger-ui .topbar { display: none }'
  },
  TAGS: [
    {
      name: 'Scrape',
      description: 'Web scraping operations'
    },
    {
      name: 'App',
      description: 'Application operations'
    },
    {
      name: 'Os',
      description: 'Operating system operations'
    }
  ]
};

/**
 * Helmet Security Configuration
 */
export const HELMET_CONFIG = {
  PRODUCTION: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:']
      }
    },
    hsts: {
      maxAge: 31536000, // 1 year in seconds
      includeSubDomains: true,
      preload: true
    },
    frameguard: {
      action: 'deny'
    }
  },
  DEVELOPMENT: {
    contentSecurityPolicy: false, // Disabled for development
    frameguard: false, // Disabled for development
    dnsPrefetchControl: false, // Allow DNS prefetching in development
    referrerPolicy: { policy: 'no-referrer' }
  }
};

/**
 * Static File Server Configuration for Temporary Files
 */
export const TMP_STATIC_CONFIG = {
  MAX_AGE: '1h', // Cache files for 1 hour
  ETAG: true, // Enable ETags for caching
  LAST_MODIFIED: true, // Send Last-Modified header
  INDEX: false // Disable directory listing
};

/**
 * Scrape Test Request Body
 * Example configuration for testing the scraper functionality
 */
export const SCRAPE_TEST_REQ_BODY = {
  proxy: {
    bypassCode: process.env.SCRAPE_PROXY_BYPASS_CODE,
    auth: {
      enabled: true,
      username: 'test_user', // Changed for security - don't use real credentials
      password: 'test_password' // Changed for security - don't use real credentials
    },
    servers: [
      {
        server: 'proxy.example.com',
        port: 8080
      }
    ]
  },
  record: {
    title: 'Recording 22.04.2025 at 02:54:51',
    speedMode: 'NORMAL',
    timeoutMode: 'NORMAL',
    steps: [
      {
        type: 'setViewport',
        width: 1226,
        height: 911,
        deviceScaleFactor: 1,
        isMobile: false,
        hasTouch: false,
        isLandscape: false
      },
      {
        type: 'navigate',
        url: 'https://whatismyipaddress.com/tr/ip-im'
      }
    ]
  },
  capture: {
    request: {
      data: [
        {
          key: 'IP',
          address: 'https://whatismyipaddress.com/tr/ip-im',
          method: 'GET'
        }
      ],
      queries: [
        {
          key: 'IP',
          address: 'https://whatismyipaddress.com/tr/ip-im',
          method: 'GET'
        }
      ]
    },
    response: {
      cookies: ['PHPSESSID', 'session_id', 'session'],
      data: [
        {
          key: 'IP',
          address: 'https://whatismyipaddress.com/tr/ip-im',
          method: 'GET'
        }
      ]
    },
    selectors: [
      {
        key: 'IP',
        type: 'XPATH',
        value:
          '/html/body/div[1]/div/div/div/div/article/div/div/div[1]/div/div[2]/div/div/div/div/div/div[2]/div[1]/div[1]/p[2]/span[2]/a'
      }
    ]
  },
  headers: {
    'Accept-Language': 'en-US,en;q=0.9',
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome'
  },
  output: {
    screenshots: {
      onError: true,
      onSuccess: true
    },
    responseType: 'JSON'
  }
};
