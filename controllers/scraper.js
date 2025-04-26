/**
 * Scraper Controller
 * Handles web scraping requests using Puppeteer and Replay
 * Executes predefined steps on target websites and returns the results
 */

// Node core modules
import fs from 'fs';
import path from 'path';

// Import constants
import {
    SPEED_MODES,
    DEFAULT_SPEED_MODE,
    DEFAULT_TIMEOUT_MODE,
    TIMEOUT_MODES,
    BROWSER_CONFIG,
    DEFAULT_RESPONSE_TYPE,
    RESPONSE_TYPE_NAMES,
    SELECTOR_TYPE_NAMES,
} from '../constants.js';

// Helper functions
import { helperProxiesRandomGetOne } from '../helpers/proxies-random-get-one.js';
import { helperValidatorsScraper } from '../helpers/validators.js';
import { helperFilterSteps } from '../helpers/filter-steps.js';
import { helperBrowserSemaphore } from '../helpers/browser-semaphore.js';

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
export async function controllerScraper(req, res, next) {
    try {
        // Acquire browser semaphore lock
        await helperBrowserSemaphore.acquire();

        // Validate the request body against the defined schema
        const { error, value } = helperValidatorsScraper.validate(req.body, { abortEarly: false });

        // Return validation errors if request is invalid
        if (error) {
            res.status(400);
            throw new Error(error);
        };

        // Filter and process the steps to be executed
        const steps = helperFilterSteps(value.steps);

        const {
            proxies = [],
            proxyAuth = {},
            title,
            speedMode = DEFAULT_SPEED_MODE,
            timeoutMode = DEFAULT_TIMEOUT_MODE,
            responseType = DEFAULT_RESPONSE_TYPE,
            selectors = [],
            acceptLanguage = BROWSER_CONFIG.ACCEPT_LANGUAGE,
            userAgent = BROWSER_CONFIG.USER_AGENT,
            errorScreenshot = false,
            successScreenshot = false,
            accessPasswordWithoutProxy = null
        } = value;

        // Check if the access password is provided and matches the environment variable
        // This is used to allow access without a proxy if the password is correct
        const checkAccessPasswordWithoutProxy = accessPasswordWithoutProxy == process.env.ACCESS_PASSWORD_WITHOUT_PROXY;

        // Check if the proxy is enabled and set the access password
        if (!checkAccessPasswordWithoutProxy && (!proxies || proxies?.length == 0)) {
            res.status(401);
            throw new Error("Access denied. Proxy is required for this request.");
        };

        // Initialize browser and page variables for cleanup in finally block
        let browser = null;
        let page = null;
        let getProxy = null;

        // Configure launch options for Puppeteer
        const launchOptions = {
            headless: BROWSER_CONFIG.HEADLESS,
            args: [
                BROWSER_CONFIG.ARGS.NO_SANDBOX,
                BROWSER_CONFIG.ARGS.DISABLE_SETUID_SANDBOX,
                BROWSER_CONFIG.ARGS.DISABLE_WEB_SECURITY,
                // Arguments to enable cookies
                '--enable-cookies',
                '--enable-javascript',
                '--enable-features=NetworkService',
                '--disable-features=IsolateOrigins,site-per-process',
                // Allow third-party cookies
                '--disable-web-security',
                '--disable-features=BlockThirdPartyCookies',
            ],
            ignoreHTTPSErrors: true,
        };

        // Chrome path from environment variable if set
        // This allows for custom Chrome installations or debugging
        if (process.env.CHROME_PATH) {
            launchOptions.executablePath = process.env.CHROME_PATH;
        };

        // Proxies setup if provided
        // This allows for rotating proxies or specific proxy configurations
        if (!checkAccessPasswordWithoutProxy && proxies && proxies.length > 0) {
            getProxy = helperProxiesRandomGetOne(proxies);
            const proxyServer = `--proxy-server=${getProxy.protocol || "http"}://${getProxy.server}:${getProxy.port}`;
            launchOptions.args.push(proxyServer);
        };

        try {
            // Dynamically import Puppeteer and plugins for each request
            const puppeteerVanilla = await import('puppeteer');
            const { addExtra } = await import('puppeteer-extra');
            const puppeteer = addExtra(puppeteerVanilla);

            const { createRunner, PuppeteerRunnerExtension } = await import('@puppeteer/replay');

            // Create Extension class dynamically
            class Extension extends PuppeteerRunnerExtension {
                /**
                 * Creates an instance of Extension with customized settings
                 * 
                 * @param {Object} browser - Puppeteer Browser instance
                 * @param {Object} page - Puppeteer Page instance
                 * @param {number} timeout - Timeout value in milliseconds
                 * @param {number} speedMode - Speed mode delay in milliseconds
                 */
                constructor(browser, page, timeout, speedMode) {
                    super(browser, page);

                    this.timeout = timeout;
                    this.speedMode = speedMode;
                    this.currentStep = 0;
                };

                /**
                 * Hook executed before all steps run
                 * 
                 * @param {Object} flow - The flow object containing step information
                 * @throws {Error} Throws an error if the flow object is invalid
                 */
                async beforeAllSteps(flow) {
                    await super.beforeAllSteps(flow);

                    console.log('Starting scraper execution:', flow.title);
                    console.log(`Speed Mode: ${this.speedMode}ms delay`);
                };

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
                    };
                };

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
                    };
                };

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
                        if (this.speedMode > 0) {
                            console.log(`Applying speed mode delay: ${this.speedMode}ms`);
                            await new Promise(resolve => setTimeout(resolve, this.speedMode));
                        };

                        console.log(`Successfully completed step ${this.currentStep}: ${step.type}`);
                    } catch (error) {
                        error.message = `Error after step ${this.currentStep}: ${error.message}`;
                        throw error;
                    };
                };

                /**
                 * Hook executed after all steps are completed
                 * 
                 * @param {Object} flow - The flow object containing step information
                 * @throws {Error} Throws an error if all steps are not completed successfully
                 */
                async afterAllSteps(flow) {
                    await super.afterAllSteps(flow);
                    console.log(`Scraper execution completed. Total steps executed: ${this.currentStep}`);
                };
            }

            // Launch browser and create a new page
            browser = await puppeteer.launch(launchOptions);
            page = await browser.newPage();

            // Proxy authentication if enabled and credentials are provided
            if (!checkAccessPasswordWithoutProxy && proxyAuth?.enabled && proxyAuth?.username && proxyAuth?.password) {
                await page.authenticate({
                    username: proxyAuth.username,
                    password: proxyAuth.password,
                });
            };

            // Set timeout values for better reliability
            page.setDefaultTimeout(TIMEOUT_MODES[timeoutMode]);
            page.setDefaultNavigationTimeout(TIMEOUT_MODES[timeoutMode]);

            // Configure page settings to mimic a real browser
            await page.setJavaScriptEnabled(true);
            await page.setExtraHTTPHeaders({
                'Accept-Language': acceptLanguage,
                'User-Agent': userAgent
            });

            // Create and execute the runner with provided steps
            const runner = await createRunner(
                { title, steps },
                new Extension(browser, page, TIMEOUT_MODES[timeoutMode], SPEED_MODES[speedMode])
            );

            // Execute the defined steps using the runner
            await runner.run();

            // Initialize result variables
            let result = null;

            if (responseType === RESPONSE_TYPE_NAMES.RAW) {
                // For RAW responseType, we've already validated there's only one selector
                const selector = selectors[0];
                result = await processSelectorData({ page, selector });
            } else if (responseType === RESPONSE_TYPE_NAMES.JSON) {
                // For JSON responseType, process all selectors and return a structured response
                const selectorResults = {};

                for (const selector of selectors) {
                    const selectorValue = await processSelectorData({ page, selector });
                    selectorResults[selector.key] = selectorValue;
                };

                result = {
                    success: true,
                    data: {
                        catch: selectorResults
                    }
                };

                if (getProxy) {
                    result.data.proxy = getProxy;
                };

                if (successScreenshot && page) {
                    const screenshotUrl = await getScreenshotUrl({ page, type: 'success' });
                    result.data.screenshotUrl = screenshotUrl;
                };
            };

            await exitBrowserAndPage(browser, page); // Close browser and page if not taking screenshots

            // Send the successful response
            res.send(result);
        } catch (error) {
            // Take error screenshot if enabled and not already taken
            if (responseType === RESPONSE_TYPE_NAMES.JSON && errorScreenshot && page) {
                error.screenshotUrl = await getScreenshotUrl({ page, type: 'error' }); // Use success screenshot URL for error screenshot
            };

            if (getProxy) {
                error.proxy = getProxy;
            };

            await exitBrowserAndPage(browser, page); // Close browser and page if not taking screenshots

            throw error; // Rethrow the error for centralized handling
        } finally {
            if (!successScreenshot && !errorScreenshot) {
                await exitBrowserAndPage(browser, page); // Close browser and page if not taking screenshots
            };
        };
    } catch (error) {
        next(error); // Pass the error to the next middleware for centralized error handling
    } finally {
        // Release the browser semaphore lock
        helperBrowserSemaphore.release();
    };
};

/**
 * Safely closes browser and page instances, handling any potential errors
 * 
 * @param {Object} browser - Puppeteer Browser instance to close
 * @param {Object} page - Puppeteer Page instance to close
 * @returns {Promise<void>} Promise that resolves when browser and page are closed
 * @throws {Error} Throws an error if closing the browser or page fails
 * @throws {Error} Throws an error if the browser or page instances are not provided
 */
async function exitBrowserAndPage(browser, page) {
    if (page) {
        await page.close().catch(error => console.error("Error closing page:", error));
    };

    if (browser) {
        await browser.close().catch(error => console.error("Error closing browser:", error));
    };
};

/**
 * Process selector data based on selector type
 * 
 * @param {Object} page - Puppeteer Page instance
 * @param {Object} selector - Selector configuration object
 * @returns {Promise<String>} Extracted data from the page based on selector type
 * @throws {Error} Throws an error if selector processing fails
 */
async function processSelectorData({ page, selector }) {
    const { type, value, key } = selector;

    try {
        if (type === SELECTOR_TYPE_NAMES.FULL) {
            return await page.content();
        } else if (type === SELECTOR_TYPE_NAMES.CSS) {
            // Extract content using CSS selector
            return await page.$eval(value, (element) => {
                if (!element) {
                    throw new Error("Element not found!");
                };

                // Get both innerHTML and textContent for more reliable data extraction
                const innerHTML = element.innerHTML || "";
                const textContent = element.textContent || "";

                // If innerHTML is empty or just whitespace but textContent has content, return textContent
                if (!innerHTML.trim() && textContent.trim()) {
                    return textContent;
                };

                return innerHTML;
            });
        } else if (type === SELECTOR_TYPE_NAMES.XPATH) {
            // Extract content using XPath selector
            return await page.evaluate((value) => {
                const element = document.evaluate(value, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

                if (!element) {
                    throw new Error("Element not found!");
                }

                // Get both innerHTML and textContent for more reliable data extraction
                const innerHTML = element.innerHTML || "";
                const textContent = element.textContent || "";

                // If innerHTML is empty or just whitespace but textContent has content, return textContent
                if (!innerHTML.trim() && textContent.trim()) {
                    return textContent;
                };

                return innerHTML;
            }, value);
        };
    } catch (error) {
        error.message = `${error.message} - Code: ERROR_SELECTOR_PROCESSING - Type: ${type} - Key: ${key} - Value: ${value}`;
        throw error;
    }
};

/**
 * Generate a URL for accessing the screenshot from the web application
 * 
 * @param {Object} options - Options object
 * @param {Object} options.page - Puppeteer Page instance
 * @param {String} options.type - Type of screenshot (error or success)
 * @returns {Promise<String>} The public URL path to access the screenshot
 * @throws {Error} Throws an error if the screenshot directory cannot be created
 * @throws {Error} Throws an error if the screenshot URL generation fails
 * @throws {String} Returns "ERROR_NOT_SAVED_SCREENSHOT" if the screenshot cannot be saved
 */
async function getScreenshotUrl({ page, type }) {

    const screenshotPath = await saveScreenshot(page, type);

    const filename = path.basename(screenshotPath);

    // Create a proper URL path using the /tmp/ endpoint
    const screenshotUrl = `${process.env.WEB_ADDRESS}/tmp/${filename}`;
    console.log(`Screenshot URL generated: ${screenshotUrl}`);

    return screenshotUrl;
};

/**
 * Saves a screenshot from the page
 * 
 * @param {Object} page - Puppeteer Page instance 
 * @param {String} type - Type of screenshot (error or success)
 * @returns {Promise<String>} Path to the saved screenshot
 * @throws {Error} Throws an error if the screenshot cannot be saved
 * @throws {Error} Throws an error if the screenshot directory cannot be created
 */
async function saveScreenshot(page, type) {
    // Use TMP_DIR from environment or fallback to default
    const screenshotDir = process.env.TMP_DIR || path.join(process.cwd(), 'tmp');

    // Create directory if it doesn't exist
    if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
    };

    // Generate unique filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    // Use the type to determine the filename format
    let filename;

    // Use simple format for both success and error screenshots
    if (type === 'success') {
        filename = `success-${timestamp}.png`;
    } else if (type === 'error') {
        filename = `error-${timestamp}.png`;
    } else {
        filename = `${type}-${timestamp}.png`;
    };

    const filePath = path.join(screenshotDir, filename);

    const savedFilePath = await new Promise((resolve, reject) => {
        setTimeout(() => {
            page.screenshot({ path: filePath, fullPage: true })
                .then(() => {
                    resolve(filePath);
                }).catch((error) => {
                    reject(error);
                });
        }, 500)
    });
    console.log(`${type} screenshot taken and saved at: ${savedFilePath}`);

    return savedFilePath;
};