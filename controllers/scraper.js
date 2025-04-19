/**
 * Scraper Controller
 * Handles web scraping requests using Puppeteer and Replay
 * Executes predefined steps on target websites and returns the results
 */

// Node modules
import puppeteer from 'puppeteer';
import { createRunner, PuppeteerRunnerExtension } from '@puppeteer/replay';

// Helper functions
import setupProxyAuth from '../helpers/setup-proxy-auth.js';
import { scraperRequestSchema } from '../helpers/validators.js';
import filterSteps from '../helpers/filter-steps.js';

// Import constants
import { 
    SPEED_MODES, 
    DEFAULT_SPEED_MODE, 
    DEFAULT_TIMEOUT_MODE,
    TIMEOUT_MODES, 
    BROWSER_CONFIG 
} from '../constants.js';

/**
 * Main scraper controller function
 * Processes incoming scraping requests and returns results
 */
export default async function (req, res, next) {
    try {
        // Validate the request body against the defined schema
        const { error, value } = scraperRequestSchema.validate(req.body, { abortEarly: false });

        // Return validation errors if request is invalid
        if (error) {
            res.status(400);
            throw new Error(error);
        }

        // Filter and process the steps to be executed
        const steps = filterSteps(value.steps);
        
        const { proxy, title, speedMode = DEFAULT_SPEED_MODE, timeoutMode = DEFAULT_TIMEOUT_MODE } = value;

        // Initialize browser and page variables for cleanup in finally block
        let browser = null;
        let page = null;

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
                'Accept-Language': BROWSER_CONFIG.ACCEPT_LANGUAGE,
                'User-Agent': BROWSER_CONFIG.USER_AGENT
            });

            // Create and execute the runner with provided steps
            const runner = await createRunner(
                { title, steps }, 
                new Extension(browser, page, TIMEOUT_MODES[timeoutMode], SPEED_MODES[speedMode])
            );

            console.log('Executing record title:', title)
            await runner.run();

            // Prepare the success response with collected data
            const rawHtml = await page.content();

            // Send the successful response
            res.send(rawHtml);
        } catch (error) {
            throw error; // Rethrow the error for centralized handling
        } finally {
            // Clean up resources properly
            if (page) await page.close();
            if (browser) await browser.close();
        }
    } catch (error) {
        next(error); // Pass the error to the next middleware for centralized error handling
    }
}

/**
 * Custom extension for Puppeteer Runner
 * Provides hooks for execution lifecycle with logging
 */
class Extension extends PuppeteerRunnerExtension {
    constructor(browser, page, timeout, speedMode) {
        super(browser, page);
        this.timeout = timeout;
        this.speedMode = speedMode || SPEED_MODES.NORMAL; // Default to NORMAL if not specified
    }

    // Hook executed before all steps run
    async beforeAllSteps(flow) {
        await super.beforeAllSteps(flow);
        console.log('Starting scraper execution');
        console.log(`Speed Mode: ${this.speedMode}ms delay`);
    }

    // Hook executed before each individual step
    async beforeEachStep(step, flow) {
        await super.beforeEachStep(step, flow);
        console.log('Before execution step:', step);
    }

    // Hook executed after each individual step
    async afterEachStep(step, flow) {
        await super.afterEachStep(step, flow);
        
        // Apply the speed mode delay after each step
        if (this.speedMode > 0) {
            console.log(`Applying speed mode delay: ${this.speedMode}ms`);
            await new Promise(resolve => setTimeout(resolve, this.speedMode));
        }
        
        console.log('After execution step:', step);
    }

    // Hook executed after all steps are completed
    async afterAllSteps(flow) {
        await super.afterAllSteps(flow);
        console.log('Scraper execution completed');
    }
}