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

// Constants for configuration
const DEFAULT_HIGHER_TIMEOUT = parseInt(process.env.DEFAULT_HIGHER_TIMEOUT || 30000); // 30 seconds timeout for longer operations

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
        
        const { proxy, title } = value;

        // Initialize browser and page variables for cleanup in finally block
        let browser = null;
        let page = null;

        // Configure proxy settings if provided
        const proxyServer = setupProxyAuth(proxy);
        const launchOptions = {
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        };

        // Add proxy configuration if available
        if (proxyServer) {
            launchOptions.args.push(`--proxy-server=${proxyServer}`);
        }

        try {
            // Launch browser and create a new page
            browser = await puppeteer.launch(launchOptions);
            page = await browser.newPage();

            // Set timeout values for better reliability
            page.setDefaultTimeout(DEFAULT_HIGHER_TIMEOUT);
            page.setDefaultNavigationTimeout(DEFAULT_HIGHER_TIMEOUT);

            // Configure page settings to mimic a real browser
            await page.setJavaScriptEnabled(true);
            await page.setExtraHTTPHeaders({
                'Accept-Language': 'en-US,en;q=0.9',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36'
            });

            // Create and execute the runner with provided steps
            const runner = await createRunner({ title, steps }, new Extension(browser, page, DEFAULT_HIGHER_TIMEOUT));
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
    constructor(browser, page, timeout) {
        super(browser, page);
        this.timeout = timeout;
    }

    // Hook executed before all steps run
    async beforeAllSteps(flow) {
        await super.beforeAllSteps(flow);
        console.log('Starting scraper execution');
    }

    // Hook executed before each individual step
    async beforeEachStep(step, flow) {
        await super.beforeEachStep(step, flow);
        console.log('Before execution step:', step);
    }

    // Hook executed after each individual step
    async afterEachStep(step, flow) {
        await super.afterEachStep(step, flow);
        console.log('After execution step:', step);
    }

    // Hook executed after all steps are completed
    async afterAllSteps(flow) {
        await super.afterAllSteps(flow);
        console.log('Scraper execution completed');
    }
}