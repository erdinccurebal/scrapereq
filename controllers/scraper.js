/**
 * Scraper Controller
 * Handles web scraping requests using Puppeteer and Replay
 * Executes predefined steps on target websites and returns the results
 */

// Node modules
import puppeteer from 'puppeteer';
import { createRunner, PuppeteerRunnerExtension } from '@puppeteer/replay';
import fs from 'fs';
import path from 'path';

// Helper functions
import setupProxyAuth from '../helpers/setup-proxy-auth.js';
import { scraperRequestSchema } from '../helpers/validators.js';
import filterSteps from '../helpers/filter-steps.js';
import browserSemaphore from '../helpers/browser-semaphore.js';

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

/**
 * Main scraper controller function
 * Processes incoming web scraping requests and executes defined steps on target websites
 * 
 * @param {Object} req - Express request object containing scraping configuration and steps
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with scraped data or raw content based on responseType
 */
export default async function (req, res, next) {
    try {
        // Acquire browser semaphore lock
        await browserSemaphore.acquire();

        // Validate the request body against the defined schema
        const { error, value } = scraperRequestSchema.validate(req.body, { abortEarly: false });

        // Return validation errors if request is invalid
        if (error) {
            throw new Error(error);
        }

        // Filter and process the steps to be executed
        const steps = filterSteps(value.steps);

        const {
            proxy,
            title,
            speedMode = DEFAULT_SPEED_MODE,
            timeoutMode = DEFAULT_TIMEOUT_MODE,
            responseType = DEFAULT_RESPONSE_TYPE,
            selectors = [],
            acceptLanguage = BROWSER_CONFIG.ACCEPT_LANGUAGE,
            userAgent = BROWSER_CONFIG.USER_AGENT,
            errorScreenshot = false,
            successScreenshot = false
        } = value;

        // Initialize browser and page variables for cleanup in finally block
        let browser = null;
        let page = null;
        let screenshotTaken = false;

        // Configure proxy settings if provided
        const proxyServer = setupProxyAuth(proxy);
        const launchOptions = {
            headless: BROWSER_CONFIG.HEADLESS,
            args: [BROWSER_CONFIG.ARGS.NO_SANDBOX, BROWSER_CONFIG.ARGS.DISABLE_SETUID_SANDBOX],
        };

        // Chrome path from environment variable if set
        // This allows for custom Chrome installations or debugging
        if (process.env.CHROME_PATH) {
            launchOptions.executablePath = process.env.CHROME_PATH;
        }

        // Add proxy configuration if available
        if (proxyServer) {
            launchOptions.args.push(`--proxy-server=${proxyServer}`);
        }

        try {
            // Launch browser and create a new page
            browser = await puppeteer.launch(launchOptions);
            page = await browser.newPage();

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
                new Extension(browser, page, TIMEOUT_MODES[timeoutMode], SPEED_MODES[speedMode], errorScreenshot, successScreenshot)
            );

            // Log the record title being executed
            console.log('Executing record title:', title)
            // Execute the defined steps using the runner
            await runner.run();

            // Initialize result variables
            let result = null;
            let screenshotPath = null;

            // If success screenshot is requested, take screenshot at the end
            if (successScreenshot) {
                const finalScreenshotPath = await saveScreenshot(page, 'success');
                if (finalScreenshotPath) {
                    // Convert to URL format
                    screenshotPath = path.relative(process.cwd(), finalScreenshotPath).replace(/\\/g, '/');
                    screenshotPath = `${process.env.WEB_ADDRESS}/${screenshotPath}`;
                    screenshotTaken = true;
                }
            }

            if (responseType === RESPONSE_TYPE_NAMES.RAW) {
                // For RAW responseType, we've already validated there's only one selector
                const selector = selectors[0];
                result = await processSelectorData(page, selector);
            } else if (responseType === RESPONSE_TYPE_NAMES.JSON) {
                // For JSON responseType, process all selectors and return a structured response
                const selectorResults = {};

                for (const selector of selectors) {
                    const selectorValue = await processSelectorData(page, selector);
                    selectorResults[selector.key] = selectorValue;
                }

                result = {
                    success: true,
                    data: {
                        catch: selectorResults
                    }
                };

                // Add screenshot to data object
                if (screenshotPath) {
                    result.data.screenshot = screenshotPath;
                }
            }

            // Send the successful response
            res.send(result);
        } catch (error) {
            // Take error screenshot if enabled and not already taken
            if (errorScreenshot && page && !screenshotTaken) {
                try {
                    console.log("Taking error screenshot before handling the error...");
                    const errorScreenshotPath = await saveScreenshot(page, 'error');
                    if (errorScreenshotPath) {
                        const relativePath = path.relative(process.cwd(), errorScreenshotPath).replace(/\\/g, '/');
                        error.screenshot = `${process.env.WEB_ADDRESS}/${relativePath}`;
                        error.screenshotPath = errorScreenshotPath;
                        screenshotTaken = true;
                        console.log(`Error screenshot taken: ${error.screenshot}`);
                        
                        // Ensure time for screenshot to be saved
                        await new Promise(resolve => setTimeout(resolve, 500));
                    }
                } catch (screenshotError) {
                    console.error("Failed to take error screenshot:", screenshotError);
                }
            } else if (error.screenshotPath) {
                // If screenshot was already taken by Extension
                const relativePath = path.relative(process.cwd(), error.screenshotPath).replace(/\\/g, '/');
                error.screenshot = `${process.env.WEB_ADDRESS}/${relativePath}`;
            }
            
            throw error; // Rethrow the error for centralized handling
        } finally {
            // Clean up resources properly - but only after ensuring screenshots are taken
            try {
                if (screenshotTaken) {
                    // Give time for any pending screenshot operations to complete
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
                
                if (page) {
                    await page.close().catch(err => console.error("Error closing page:", err));
                }
                
                if (browser) {
                    await browser.close().catch(err => console.error("Error closing browser:", err));
                }
            } catch (closeError) {
                console.error("Error during cleanup:", closeError);
            }
        }
    } catch (error) {
        next(error); // Pass the error to the next middleware for centralized error handling
    } finally {
        // Release the browser semaphore lock
        browserSemaphore.release();
    }
}

/**
 * Process selector data based on selector type
 * 
 * @param {Object} page - Puppeteer Page instance
 * @param {Object} selector - Selector configuration object
 * @returns {String} Extracted data from the page based on selector type
 */
async function processSelectorData(page, selector) {
    try {
        const { type, value } = selector;

        if (type === SELECTOR_TYPE_NAMES.FULL) {
            // Return the entire page content
            return await page.content();
        } else if (type === SELECTOR_TYPE_NAMES.CSS) {
            // Extract content using CSS selector
            return await page.$eval(value, (el) => {
                return el ? el?.innerHTML : "NOT FOUND ELEMENT";
            }).catch(() => "SELECTOR ERROR");
        } else if (type === SELECTOR_TYPE_NAMES.XPATH) {
            // Extract content using XPath selector
            return await page.evaluate((xpath) => {
                const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                return element ? element.innerHTML : "NOT FOUND ELEMENT";
            }, value).catch(() => "SELECTOR ERROR");
        }

        return "INVALID SELECTOR TYPE";
    } catch (error) {
        console.error('Error processing selector:', error);
        return "SELECTOR PROCESSING ERROR";
    }
}

/**
 * Saves a screenshot from the page
 * 
 * @param {Object} page - Puppeteer Page instance 
 * @param {String} type - Type of screenshot (error or success)
 * @param {Number} stepIndex - Current step index when the screenshot was taken
 * @returns {String} Path to the saved screenshot
 */
async function saveScreenshot(page, type) {
    try {
        // Create directory if it doesn't exist
        const screenshotDir = path.join(process.cwd(), 'tmp');
        if (!fs.existsSync(screenshotDir)) {
            fs.mkdirSync(screenshotDir, { recursive: true });
        }

        // Generate unique filename with timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        let filename;

        // Use simple format for both success and error screenshots
        if (type === 'success') {
            filename = `success-${timestamp}.png`;
        } else if (type === 'error') {
            filename = `error-${timestamp}.png`;
        } else {
            filename = `${type}-${timestamp}.png`;
        }

        const filePath = path.join(screenshotDir, filename);

        // Take screenshot
        try {
            await page.screenshot({ path: filePath, fullPage: true });
        } catch (error) {
            console.error('Error taking screenshot:', error);
        }

        console.log(`${type} screenshot taken and saved at: ${filePath}`);

        return filePath;
    } catch (error) {
        console.error(`Failed to take ${type} screenshot:`, error);
        return null;
    }
}

/**
 * Custom extension for Puppeteer Runner
 * Provides hooks for execution lifecycle with logging
 * 
 * @class Extension
 * @extends PuppeteerRunnerExtension
 */
class Extension extends PuppeteerRunnerExtension {
    /**
     * Creates an instance of Extension with customized settings
     * 
     * @param {Object} browser - Puppeteer Browser instance
     * @param {Object} page - Puppeteer Page instance
     * @param {number} timeout - Timeout value in milliseconds
     * @param {number} speedMode - Speed mode delay in milliseconds
     * @param {boolean} errorScreenshot - Whether to take screenshots on errors
     * @param {boolean} successScreenshot - Whether to take a screenshot after all steps complete successfully
     */
    constructor(browser, page, timeout, speedMode, errorScreenshot = false, successScreenshot = false) {
        super(browser, page);
        this.timeout = timeout;
        this.speedMode = speedMode || SPEED_MODES.NORMAL; // Default to NORMAL if not specified
        this.currentStepIndex = -1; // Initially -1, will start at 0 when execution begins
        this.errorScreenshot = errorScreenshot;
        this.successScreenshot = successScreenshot;
    }

    /**
     * Hook executed before all steps run
     * 
     * @param {Object} flow - The flow object containing step information
     */
    async beforeAllSteps(flow) {
        await super.beforeAllSteps(flow);
        console.log('Starting scraper execution');
        console.log(`Speed Mode: ${this.speedMode}ms delay`);
        console.log(`Error Screenshot: ${this.errorScreenshot ? 'Enabled' : 'Disabled'}`);
        console.log(`Success Screenshot: ${this.successScreenshot ? 'Enabled' : 'Disabled'}`);
        this.currentStepIndex = -1; // Reset step index before execution starts
    }

    /**
     * Hook executed before each individual step
     * 
     * @param {Object} step - The current step being executed
     * @param {Object} flow - The flow object containing step information
     */
    async beforeEachStep(step, flow) {
        try {
            this.currentStepIndex++; // Increment step index
            await super.beforeEachStep(step, flow);
            console.log(`Executing step ${this.currentStepIndex + 1}: ${step.type}`);
        } catch (error) {
            // Take screenshot when error occurs
            if (this.errorScreenshot && this.page) {
                try {
                    console.log(`Taking error screenshot for beforeEachStep at step ${this.currentStepIndex + 1}...`);
                    const screenshotPath = await saveScreenshot(this.page, 'error');
                    if (screenshotPath) {
                        error.screenshotPath = screenshotPath;
                        console.log(`Error screenshot saved for beforeEachStep: ${screenshotPath}`);
                    }
                } catch (screenshotError) {
                    console.error(`Failed to take error screenshot in beforeEachStep:`, screenshotError);
                }
            }
            
            // Add step index to error message
            error.message = `Error at step ${this.currentStepIndex + 1}: ${error.message}`;
            throw error;
        }
    }

    /**
     * Hook executed after each individual step
     * Applies the configured speed mode delay after each step
     * 
     * @param {Object} step - The current step being executed
     * @param {Object} flow - The flow object containing step information
     */
    async afterEachStep(step, flow) {
        try {
            await super.afterEachStep(step, flow);

            // Apply the speed mode delay after each step
            if (this.speedMode > 0) {
                console.log(`Applying speed mode delay: ${this.speedMode}ms`);
                await new Promise(resolve => setTimeout(resolve, this.speedMode));
            }

            console.log(`Successfully completed step ${this.currentStepIndex + 1}: ${step.type}`);
        } catch (error) {
            // Take screenshot when error occurs
            if (this.errorScreenshot && this.page) {
                try {
                    console.log(`Taking error screenshot for afterEachStep at step ${this.currentStepIndex + 1}...`);
                    const screenshotPath = await saveScreenshot(this.page, 'error');
                    if (screenshotPath) {
                        error.screenshotPath = screenshotPath;
                        console.log(`Error screenshot saved for afterEachStep: ${screenshotPath}`);
                    }
                } catch (screenshotError) {
                    console.error(`Failed to take error screenshot in afterEachStep:`, screenshotError);
                }
            }
            
            // Add step index to error message
            error.message = `Error after step ${this.currentStepIndex + 1}: ${error.message}`;
            throw error;
        }
    }

    /**
     * Hook executed after all steps are completed
     * 
     * @param {Object} flow - The flow object containing step information
     */
    async afterAllSteps(flow) {
        await super.afterAllSteps(flow);
        console.log(`Scraper execution completed. Total steps executed: ${this.currentStepIndex + 1}`);
    }

    /**
     * Override step execution to catch errors with step index information
     * 
     * @param {Object} step - The current step being executed
     * @param {Object} flow - The flow object containing step information
     */
    async runStep(step, flow) {
        try {
            return await super.runStep(step, flow);
        } catch (error) {
            // Take screenshot when error occurs during step execution
            if (this.errorScreenshot && this.page) {
                try {
                    console.log(`Taking error screenshot for step ${this.currentStepIndex + 1} (${step.type})...`);
                    const screenshotPath = await saveScreenshot(this.page, 'error');
                    if (screenshotPath) {
                        error.screenshotPath = screenshotPath;
                        console.log(`Error screenshot saved for step ${this.currentStepIndex + 1}: ${screenshotPath}`);
                    }
                } catch (screenshotError) {
                    console.error(`Failed to take error screenshot for step ${this.currentStepIndex + 1}:`, screenshotError);
                }
            }
            
            // Add step index to the error that occurred during step execution
            error.message = `Error executing step ${this.currentStepIndex + 1} (${step.type}): ${error.message}`;
            throw error;
        }
    }
}