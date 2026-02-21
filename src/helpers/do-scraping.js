/**
 * Scraper Controller
 * Handles web scraping requests using Puppeteer and Replay
 * Executes predefined steps on target websites and returns the results
 */

// Node core modules
import fs from 'fs';
import path from 'path';

// Import config
import { config } from '../config.js';

// Import constants
import {
  SPEED_MODES,
  TIMEOUT_MODES,
  BROWSER_CONFIG,
  RESPONSE_TYPE_NAMES,
  SELECTOR_TYPE_NAMES
} from '../constants.js';

// Helper functions
import { helperProxiesRandomGetOne } from './proxies-random-get-one.js';
import { helperBrowserSemaphore } from './browser-semaphore.js';

/**
 * Main scraper controller function
 * Processes incoming web scraping requests and executes defined steps on target websites
 *
 * @param {Object} req - Express request object containing scraping configuration and steps
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>} - Returns a promise that resolves when the scraping is complete
 * @throws {Error} - Throws an error if the scraping process fails at any point
 * @throws {Error} - Throws an error if the request body validation fails
 * @throws {Error} - Throws an error if the browser or page instances cannot be created or closed
 */
export async function helperDoScraping({ headers, proxy, record, capture, output }) {
  // Launch options and proxy settings
  const { launchOptions, getProxy, pageAuthenticateEnabled, pageAuthenticateParams } =
    generateLaunchOptions({ proxy });

  // Initialize browser and page variables for cleanup in finally block
  let browser = null;
  let page = null;

  const { screenshots, responseType } = output;

  try {
    // Acquire browser semaphore lock
    await helperBrowserSemaphore.acquire();

    // Dynamically import Puppeteer and plugins for each request
    const { puppeteer, createRunner, PuppeteerRunnerExtension } =
      await importPuppeteerDependencies();

    // Create Extension class dynamically
    class Extension extends PuppeteerRunnerExtension {
      /**
       * Creates an instance of Extension with customized settings
       *
       * @param {Object} browser - Puppeteer Browser instance
       * @param {Object} page - Puppeteer Page instance
       * @param {number} timeout - Timeout value in milliseconds
       * @param {number} speed - Speed mode delay in milliseconds
       */
      constructor(browser, page, timeout, speed) {
        super(browser, page);

        this.timeout = timeout;
        this.speed = speed;
        this.currentStep = 0;
      }

      /**
       * Hook executed before all steps run
       *
       * @param {Object} flow - The flow object containing step information
       * @throws {Error} Throws an error if the flow object is invalid
       */
      async beforeAllSteps(flow) {
        await super.beforeAllSteps(flow);

        console.log('Starting scraper execution:', flow.title);
        console.log(`Speed Mode: ${this.speed}ms delay`);
      }

      /**
       * Hook executed before each individual step
       *
       * @param {Object} step - The current step being executed
       * @param {Object} flow - The flow object containing step information
       * @throws {Error} Throws an error with step index information if pre-step operations fail
       */
      async beforeEachStep(step, flow) {
        try {
          this.currentStep++;
          await super.beforeEachStep(step, flow);
          console.log(`Executing step ${this.currentStep}: ${step.type}`);
        } catch (error) {
          error.message = `Error at step ${this.currentStep}: ${error.message}`;
          throw error;
        }
      }

      /**
       * Override step execution to catch errors with step index information
       *
       * @param {Object} step - The current step being executed
       * @param {Object} flow - The flow object containing step information
       * @returns {Promise<Object>} The result of the step execution
       * @throws {Error} Throws an error if the step execution fails
       */
      async runStep(step, flow) {
        try {
          return await super.runStep(step, flow);
        } catch (error) {
          error.message = `Error executing step ${this.currentStep} (${step.type}): ${error.message}`;
          throw error;
        }
      }

      /**
       * Hook executed after each individual step
       * Applies the configured speed mode delay after each step
       *
       * @param {Object} step - The current step being executed
       * @param {Object} flow - The flow object containing step information
       * @throws {Error} Throws an error with step information if post-step operations fail
       */
      async afterEachStep(step, flow) {
        try {
          await super.afterEachStep(step, flow);

          // Apply the speed mode delay after each step
          if (this.speed > 0) {
            console.log(`Applying speed mode delay: ${this.speed}ms`);
            await new Promise((resolve) => setTimeout(resolve, this.speed));
          }

          console.log(`Successfully completed step ${this.currentStep}: ${step.type}`);
        } catch (error) {
          error.message = `Error after step ${this.currentStep}: ${error.message}`;
          throw error;
        }
      }

      /**
       * Hook executed after all steps are completed
       *
       * @param {Object} flow - The flow object containing step information
       * @throws {Error} Throws an error if all steps are not completed successfully
       */
      async afterAllSteps(flow) {
        await super.afterAllSteps(flow);
        console.log(`Scraper execution completed. Total steps executed: ${this.currentStep}`);
      }
    }

    // Launch browser and create a new page
    browser = await puppeteer.launch(launchOptions);
    page = await browser.newPage();

    await setPageGeneral({
      page,
      headers,
      record,
      pageAuthenticateEnabled,
      pageAuthenticateParams
    });

    const { title, timeoutMode, speedMode, steps } = record;

    // Create and execute the runner with provided steps
    const runner = await createRunner(
      { title, steps },
      new Extension(browser, page, TIMEOUT_MODES[timeoutMode], SPEED_MODES[speedMode])
    );

    // Execute the defined steps using the runner
    await runner.run();

    // Initialize result variables
    let result = null;

    const { selectors } = capture;

    if (responseType === RESPONSE_TYPE_NAMES.NONE) {
      // For NONE responseType, return a simple success response without data
      result = { success: true };

      if (getProxy) {
        result.proxy = getProxy;
      }
    } else if (responseType === RESPONSE_TYPE_NAMES.RAW) {
      // For RAW responseType, we've already validated there's only one selector
      const selector = selectors[0];
      result = await processSelectorData({ page, selector });
    } else if (responseType === RESPONSE_TYPE_NAMES.JSON) {
      // For JSON responseType, process all selectors and return a structured response
      const selectorResults = {};

      for (const selector of selectors) {
        const selectorValue = await processSelectorData({ page, selector });
        selectorResults[selector.key] = selectorValue;
      }

      // Create a structured response with selector results
      result = {
        success: true,
        data: {
          catch: selectorResults
        }
      };

      // Add proxy information to the response if available
      if (getProxy) {
        result.data.proxy = getProxy;
      }

      // Add success screenshot URL if enabled
      if (screenshots.onSuccess && page) {
        const { screenshotUrl } = await getScreenshotUrl({ page, type: 'success' });
        result.data.screenshotUrl = screenshotUrl;
      }
    }

    await exitBrowserAndPage(browser, page); // Close browser and page if not taking screenshots

    // Return the successful result to the controller
    return result;
  } catch (error) {
    // Take error screenshot if enabled and not already taken
    if (responseType === RESPONSE_TYPE_NAMES.JSON && screenshots.onError && page) {
      const { screenshotUrl } = await getScreenshotUrl({ page, type: 'error' });
      error.screenshotUrl = screenshotUrl;
    }

    if (getProxy) {
      error.proxy = getProxy;
    }

    await exitBrowserAndPage(browser, page); // Close browser and page if not taking screenshots

    throw error; // Rethrow the error for centralized handling
  } finally {
    helperBrowserSemaphore.release();

    if (!screenshots.onSuccess && !screenshots.onError) {
      await exitBrowserAndPage(browser, page); // Close browser and page if not taking screenshots
    }
  }
}

/**
 * Generates browser launch options and configures proxy settings
 *
 * @param {Object} res - Express response object for sending error responses
 * @param {Array} proxies - Array of proxy configurations
 * @param {String} accessPasswordWithoutProxy - Access password for bypassing proxy requirement
 * @param {Object} proxyAuth - Proxy authentication credentials and settings
 * @returns {Object} - Returns launch options and proxy information
 * @throws {Error} - Throws an error if the access password is invalid or missing
 * @throws {Error} - Throws an error if the proxy configuration fails
 */
function generateLaunchOptions({ proxy }) {
  // Initialize variables
  let getProxy = null;
  let launchOptions = null;
  let pageAuthenticateEnabled = false;
  let pageAuthenticateParams = {};

  try {
    // Configure launch options for Puppeteer with modern defaults
    launchOptions = {
      headless: BROWSER_CONFIG.HEADLESS,
      args: [
        BROWSER_CONFIG.ARGS.NO_SANDBOX,
        BROWSER_CONFIG.ARGS.DISABLE_SETUID_SANDBOX,
        BROWSER_CONFIG.ARGS.DISABLE_WEB_SECURITY,
        // Performance and feature flags
        '--disable-dev-shm-usage', // Fix for Docker containers with limited memory
        '--disable-gpu', // Disable GPU acceleration in headless mode
        '--disable-setuid-sandbox', // Enhanced security
        // Cookie and JavaScript related settings
        '--enable-cookies',
        '--enable-javascript',
        '--enable-features=NetworkService',
        '--disable-features=IsolateOrigins,site-per-process',
        // Allow third-party cookies for site compatibility
        '--disable-web-security',
        '--disable-features=BlockThirdPartyCookies',
        // Memory optimization
        '--js-flags=--max-old-space-size=512' // Control memory usage
      ],
      ignoreHTTPSErrors: true,
      defaultViewport: {
        width: 1366,
        height: 768,
        deviceScaleFactor: 1,
        isMobile: false,
        hasTouch: false,
        isLandscape: true
      }
    };

    // Chrome path from environment variable if set
    const chromePath = process.env.CHROME_PATH;
    if (chromePath) {
      launchOptions.executablePath = chromePath;
    }
  } catch (error) {
    error.code = 'ERROR_HELPER_LAUNCH_OPTIONS_GENERATION';
    throw error;
  }

  try {
    const { auth, bypassCode, servers } = proxy;

    // Check if proxy bypass is enabled via password
    const proxyBypassCode = bypassCode === process.env.SCRAPE_PROXY_BYPASS_CODE;

    // Validate proxy requirements
    if (!proxyBypassCode && servers.length === 0) {
      const error = new Error('Access denied. Valid proxy configuration is required for this request.');
      error.status = 401;
      throw error;
    }

    // Setup proxy if required and available
    if (!proxyBypassCode && servers.length > 0) {
      try {
        // Use the helper to get a random proxy from the list
        getProxy = helperProxiesRandomGetOne({ servers });

        // Validate proxy structure
        if (!getProxy || !getProxy.server || !getProxy.port) {
          throw new Error('Invalid proxy configuration structure');
        }

        const proxyServer = `${getProxy.protocol}://${getProxy.server}:${getProxy.port}`;
        launchOptions.args.push(`--proxy-server=${proxyServer}`);

        // Log proxy usage (without sensitive details)
        console.log(`Using proxy: ${proxyServer}`);
      } catch (proxyError) {
        throw new Error(`Proxy selection failed: ${proxyError.message}`);
      }
    }

    const { enabled, username, password } = auth;

    // Setup proxy authentication if enabled and credentials are provided
    if (!proxyBypassCode && enabled === true && username && password) {
      pageAuthenticateEnabled = true;
      pageAuthenticateParams = { username, password };
      console.log(`Proxy authentication enabled for user: ${username}`);
    }
  } catch (error) {
    error.code = 'ERROR_PROXY_SETUP';
    throw error;
  }

  return { launchOptions, getProxy, pageAuthenticateEnabled, pageAuthenticateParams };
}

/**
 * Dynamically import Puppeteer and plugins for each request
 * This allows for better memory management and isolation between requests
 */
async function importPuppeteerDependencies() {
  try {
    const [puppeteerVanilla, { addExtra }, { createRunner, PuppeteerRunnerExtension }] =
      await Promise.all([
        import('puppeteer'),
        import('puppeteer-extra'),
        import('@puppeteer/replay')
      ]);

    const puppeteer = addExtra(puppeteerVanilla);

    return { puppeteer, createRunner, PuppeteerRunnerExtension };
  } catch (error) {
    throw new Error(`Error importing Puppeteer dependencies: ${error.message}`);
  }
}

/**
 * Sets up the page with general configurations
 *
 * @param {Object} page - Puppeteer Page instance to configure
 * @param {String} acceptLanguage - Accept-Language header value
 * @param {String} userAgent - User-Agent header value
 * @param {Boolean} pageAuthenticateEnabled - Flag indicating if proxy authentication is enabled
 * @param {Object} pageAuthenticateParams - Proxy authentication parameters
 * @param {String} timeoutMode - Timeout mode for the page
 * @returns {Promise<void>} - Returns a promise that resolves when the page is configured
 * @throws {Error} - Throws an error if the page configuration fails
 */
async function setPageGeneral({
  page,
  headers,
  record,
  pageAuthenticateEnabled,
  pageAuthenticateParams
}) {
  try {
    // Proxy authentication if enabled and credentials are provided
    if (pageAuthenticateEnabled) {
      await page.authenticate(pageAuthenticateParams);
    }

    const { timeoutMode } = record;

    // Set timeout values for better reliability
    page.setDefaultTimeout(TIMEOUT_MODES[timeoutMode]);
    page.setDefaultNavigationTimeout(TIMEOUT_MODES[timeoutMode]);

    // Configure page settings to mimic a real browser
    await page.setJavaScriptEnabled(true);
    await page.setExtraHTTPHeaders(headers);
  } catch (error) {
    error.code = 'ERROR_PAGE_GENERAL_SETUP';
    throw error;
  }
}

/**
 * Process selector data based on selector type (FULL, CSS, XPATH)
 *
 * @param {Object} page - Puppeteer Page instance
 * @param {Object} selector - Selector configuration object with type, value and key properties
 * @returns {Promise<String>} - Extracted data from the page based on selector type
 * @throws {Error} - Throws an error if selector processing fails or element is not found
 */
async function processSelectorData({ page, selector }) {
  const { type, value, key } = selector;

  try {
    // Validate input parameters
    if (!page) {
      throw new Error('Puppeteer page instance is required');
    }

    if (!selector || !type || value === undefined) {
      throw new Error('Invalid selector configuration');
    }

    if (type === SELECTOR_TYPE_NAMES.FULL) {
      return await page.content();
    } else if (type === SELECTOR_TYPE_NAMES.CSS) {
      // First check if element exists
      const elementExists = await page.$(value);
      if (!elementExists) {
        throw new Error(`CSS Selector not found on page: ${value}`);
      }

      // Extract content using CSS selector with enhanced error handling
      return await page.$eval(value, (element) => {
        // Get both innerHTML and textContent for more reliable data extraction
        const innerHTML = element.innerHTML || '';
        const textContent = element.textContent || '';
        const value = element.value || ''; // For input elements

        // Special handling for input, select, and textarea elements
        const tagName = element.tagName.toLowerCase();
        if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
          return value || textContent;
        }

        // If innerHTML is empty or just whitespace but textContent has content, return textContent
        if (!innerHTML.trim() && textContent.trim()) {
          return textContent;
        }

        return innerHTML;
      });
    } else if (type === SELECTOR_TYPE_NAMES.XPATH) {
      // Verify XPath selector exists first
      const elementExists = await page.$x(value);
      if (!elementExists || elementExists.length === 0) {
        throw new Error(`XPath selector not found on page: ${value}`);
      }

      // Extract content using XPath selector with enhanced error handling
      return await page.evaluate((xpathValue) => {
        const element = document.evaluate(
          xpathValue,
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue;

        if (!element) {
          throw new Error('Element not found during evaluation');
        }

        // Get both innerHTML and textContent for more reliable data extraction
        const innerHTML = element.innerHTML || '';
        const textContent = element.textContent || '';
        const value = element.value || ''; // For input elements

        // Special handling for input, select, and textarea elements
        const tagName = element.tagName.toLowerCase();
        if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
          return value || textContent;
        }

        // If innerHTML is empty or just whitespace but textContent has content, return textContent
        if (!innerHTML.trim() && textContent.trim()) {
          return textContent;
        }

        return innerHTML;
      }, value);
    } else {
      throw new Error(`Unsupported selector type: ${type}`);
    }
  } catch (error) {
    // Enhance error message with context information
    const contextMessage = `Error processing selector - Type: ${type} - Key: ${key} - Value: ${value}`;
    error.message = `${error.message} - ${contextMessage}`;
    error.code = 'ERROR_SELECTOR_PROCESSING';
    throw error;
  }
}

/**
 * Generate a URL for accessing the screenshot from the web application
 *
 * @param {Object} page - Puppeteer Page instance
 * @param {String} type - Type of screenshot (success or error)
 * @returns {Promise<Object>} - Returns an object containing the screenshotUrl
 * @throws {Error} - Throws an error if the screenshot generation fails
 */
async function getScreenshotUrl({ page, type }) {
  try {
    const screenshotsDir = process.env.TMP_DIR || path.join(process.cwd(), 'tmp');

    // Create directory if it doesn't exist
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }

    // Generate unique filename with UUID and timestamp for better uniqueness
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const randomId = Math.random().toString(36).substring(2, 8); // Simple unique ID generator
    const filename = `${type}-${timestamp}-${randomId}.png`;
    const filePath = path.join(screenshotsDir, filename);

    // Wait a brief moment before taking screenshot to allow page to stabilize
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Use try/catch specifically for screenshot to provide better error details
    try {
      // Take the screenshot with more options for better quality
      await page.screenshot({
        path: filePath,
        fullPage: true
      });
    } catch (screenshotError) {
      throw new Error(`Failed to take screenshot: ${screenshotError.message}`);
    }

    console.log(`${type} screenshot taken and saved at: ${filePath}`);

    // Get the base filename for the URL
    const savedFilename = path.basename(filePath);

    // Create a proper URL path using the /tmp/ endpoint
    const webAddress =
      process.env.WEB_ADDRESS || `http://${config.server.host}:${config.server.port}`;
    const screenshotUrl = `${webAddress}/api/tmp/${savedFilename}`;
    console.log(`Screenshot URL generated: ${screenshotUrl}`);

    return { screenshotUrl };
  } catch (error) {
    error.message = `Error generating screenshot: ${error.message} - Type: ${type}`;
    error.code = 'ERROR_SCREENSHOT_URL_GENERATION';
    throw error;
  }
}

/**
 * Safely closes browser and page instances, handling any potential errors
 *
 * @param {Object} browser - Puppeteer Browser instance to close
 * @param {Object} page - Puppeteer Page instance to close
 * @returns {Promise<void>} - Promise that resolves when browser and page are closed
 */
async function exitBrowserAndPage(browser, page) {
  try {
    // First close the page if it exists and is not closed
    if (page) {
      try {
        await page.close();
      } catch (error) {
        console.error('Error closing page:', error.message);
      }
    }

    // Then close the browser if it exists
    if (browser) {
      try {
        await browser.close();
      } catch (error) {
        console.error('Error closing browser:', error.message);
      }
    }
  } catch (error) {
    console.error('Unexpected error during browser/page cleanup:', error.message);
  }
}
