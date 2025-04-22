/**
 * Routes Configuration
 * Centralizes all route definitions for the application
 * @swagger
 * tags:
 *   - name: Health
 *     description: API status check operations
 *   - name: Scraper
 *     description: Web scraping operations
 *   - name: General
 *     description: General operations and utilities
 */

// Import Express framework for routing
import express from 'express';
// Import basic authentication middleware
import basicAuth from 'express-basic-auth';

// Controller imports
import controllerScraper from './controllers/scraper.js';
import controllerHealth from './controllers/health.js';
import controllerAppShutdown from './controllers/app-shutdown.js';
import controllerOsRestart from './controllers/os-restart.js';

// Import constants
import { AUTH_DEFAULTS } from './constants.js';

// Initialize Express Router
const router = express.Router();

// Basic auth middleware - Secures all routes with username/password authentication
// Uses environment variables or defaults to defined constants if not set
router.use(basicAuth({
    users: {
        [process.env.AUTH_USERNAME || AUTH_DEFAULTS.USERNAME]: process.env.AUTH_PASSWORD || AUTH_DEFAULTS.PASSWORD
    }
}));

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Checks system status
 *     description: Verifies that API and Puppeteer are operational
 *     tags: [Health]
 *     security:
 *       - basicAuth: []
 *     responses:
 *       200:
 *         description: API and browser are working
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     project:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: "req-scrap"
 *                         description:
 *                           type: string
 *                           example: "Web scraping API using puppeteer"
 *                         version:
 *                           type: string
 *                           example: "1.0.0"
 *                         author:
 *                           type: string
 *                           example: "Erdinç Cürebal"
 *                         license:
 *                           type: string
 *                           example: "ISC"
 *                     app:
 *                       type: object
 *                       properties:
 *                         environment:
 *                           type: string
 *                           example: "development"
 *                         port:
 *                           type: string
 *                           example: "3000"
 *                         host:
 *                           type: string
 *                           example: "localhost"
 *                         uptime:
 *                           type: string
 *                           example: "2m 24s"
 *                         pid:
 *                           type: number
 *                           example: 2160
 *                         puppeteer:
 *                           type: object
 *                           properties:
 *                             success:
 *                               type: boolean
 *                               example: true
 *                             data:
 *                               type: object
 *                               properties:
 *                                 testUrl:
 *                                   type: string
 *                                   example: "https://www.google.com"
 *                                 resultUrl:
 *                                   type: string
 *                                   example: "https://www.google.com/"
 *                                 resultTitle:
 *                                   type: string
 *                                   example: "Google"
 *                                 message:
 *                                   type: string
 *                                   example: "Puppeteer is working correctly."
 *                     system:
 *                       type: object
 *                       properties:
 *                         timestamp:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-04-19T17:08:23.717Z"
 *                         timezone:
 *                           type: string
 *                           example: "Europe/Istanbul"
 *                         platform:
 *                           type: string
 *                           example: "win32"
 *                         arch:
 *                           type: string
 *                           example: "x64"
 *                         release:
 *                           type: string
 *                           example: "10.0.19045"
 *                         cpus:
 *                           type: number
 *                           example: 12
 *                         totalmem:
 *                           type: string
 *                           example: "16331.95"
 *                         freemem:
 *                           type: string
 *                           example: "9424.20"
 *       500:
 *         description: System error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "lorem is not a function"
 *                     stack:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: [
 *                         "string",
 *                       ]
 */
router.get("/health", controllerHealth);

/**
 * @swagger
 * /:
 *   post:
 *     summary: Execute web scraping operations
 *     description: Perform web scraping based on defined steps and selectors
 *     tags: [Scraper]
 *     security:
 *       - basicAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - steps
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title or name of the scraping task (required)
 *                 example: "Amazon Product Price Scraper"
 *               responseType:
 *                 type: string
 *                 enum: [NONE, JSON, RAW]
 *                 description: Output format of the scraped data
 *                 example: "JSON"
 *               speedMode:
 *                 type: string
 *                 enum: [TURBO, FAST, NORMAL, SLOW, SLOWEST, CRAWL, STEALTH]
 *                 description: Controls execution speed between scraping steps
 *                 example: "NORMAL"
 *               errorScreenshot:
 *                 type: boolean
 *                 description: Take screenshots on error occurrences
 *                 example: true
 *               successScreenshot:
 *                 type: boolean
 *                 description: Take screenshots after successful steps
 *                 example: false
 *               timeoutMode:
 *                 type: string
 *                 enum: [SHORT, NORMAL, LONG]
 *                 description: Sets timeout duration for operations
 *                 example: "NORMAL"
 *               acceptLanguage:
 *                 type: string
 *                 description: Language header for browser requests
 *                 example: "en-US,en;q=0.9"
 *               userAgent:
 *                 type: string
 *                 description: Browser user-agent string
 *                 example: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36"
 *               selectors:
 *                 type: array
 *                 description: Data extraction selector configurations for scraping (Required when responseType is not NONE, forbidden when responseType is NONE)
 *                 items:
 *                   type: object
 *                   required:
 *                     - key
 *                     - type
 *                     - value
 *                   properties:
 *                     key:
 *                       type: string
 *                       description: Unique identifier for the selector
 *                       example: "price"
 *                     type:
 *                       type: string
 *                       enum: [CSS, XPATH, FULL]
 *                       description: Type of selector to use
 *                       example: "XPATH"
 *                     value:
 *                       type: string
 *                       description: Selector string to locate elements
 *                       example: "/html/body/div[1]/div/div/div[4]/div[1]/div[6]/div/div[1]/div/div/div/form/div/div/div/div/div[3]/div/div[1]/div/div/span[1]/span[2]/span[2]/text()"
 *                 example:
 *                   - key: "price"
 *                     type: "XPATH"
 *                     value: "/html/body/div[1]/div/div/div[4]/div[1]/div[6]/div/div[1]/div/div/div/form/div/div/div/div/div[3]/div/div[1]/div/div/span[1]/span[2]/span[2]/text()"
 *                   - key: "title"
 *                     type: "CSS"
 *                     value: "#productTitle"
 *               proxy:
 *                 type: object
 *                 description: Proxy configuration for web requests
 *                 properties:
 *                   enabled:
 *                     type: boolean
 *                     description: Enable/disable proxy usage (required)
 *                     example: false
 *                   server:
 *                     type: string
 *                     description: Proxy server hostname or IP (required)
 *                     example: "proxy.example.com"
 *                   port:
 *                     type: number
 *                     description: Proxy server port (required)
 *                     example: 8080
 *                   username:
 *                     type: string
 *                     description: Proxy authentication username
 *                     example: "username"
 *                   password:
 *                     type: string
 *                     description: Proxy authentication password
 *                     example: "password"
 *                   protocol:
 *                     type: string
 *                     description: Proxy protocol
 *                     enum: [http, https, socks4, socks5]
 *                     example: "http"
 *               steps:
 *                 type: array
 *                 description: Sequence of browser actions to perform (required with at least one navigate step containing a valid URL)
 *                 items:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       description: Type of browser action
 *                       enum: [navigate, click, wait, setViewport, change, waitForElement]
 *                       example: "navigate"
 *                     url:
 *                       type: string
 *                       description: URL for navigation steps
 *                       example: "https://www.amazon.com/dp/B00IJ0ALYS"
 *                     width:
 *                       type: number
 *                       description: Browser viewport width (for setViewport)
 *                       example: 1356
 *                     height:
 *                       type: number
 *                       description: Browser viewport height (for setViewport)
 *                       example: 963
 *                     deviceScaleFactor:
 *                       type: number
 *                       description: Device scale factor (for setViewport)
 *                       example: 1
 *                     isMobile:
 *                       type: boolean
 *                       description: Mobile device emulation (for setViewport)
 *                       example: false
 *                     hasTouch:
 *                       type: boolean
 *                       description: Touch support emulation (for setViewport)
 *                       example: false
 *                     isLandscape:
 *                       type: boolean
 *                       description: Landscape orientation (for setViewport)
 *                       example: false
 *                     selectors:
 *                       type: array
 *                       description: Element selectors for click operations
 *                       example: [["#glow-ingress-line2"]]
 *                     target:
 *                       type: string
 *                       description: Target frame for the action
 *                       example: "main"
 *                     value:
 *                       type: string
 *                       description: Value to set for input fields (for change action) or URL for navigation
 *                       example: "search keyword"
 *                     offsetX:
 *                       type: number
 *                       description: X-coordinate offset for click operations
 *                       example: 28
 *                     offsetY:
 *                       type: number
 *                       description: Y-coordinate offset for click operations
 *                       example: 9
 *                     frame:
 *                       type: array
 *                       description: Frame indices for nested frames
 *                       items:
 *                         type: number
 *                       example: [0]
 *                     duration:
 *                       type: number
 *                       description: Duration of action in milliseconds
 *                       example: 50
 *                     deviceType:
 *                       type: string
 *                       description: Type of device simulated for interaction
 *                       example: "mouse"
 *                     button:
 *                       type: string
 *                       description: Mouse button used for click
 *                       example: "primary"
 *                     timeout:
 *                       type: number
 *                       description: Timeout duration for the step in milliseconds
 *                       example: 5000
 *                     operator:
 *                       type: string
 *                       description: Comparison operator for waitForElement
 *                       example: ">="
 *                     count:
 *                       type: number
 *                       description: Element count for waitForElement
 *                       example: 1
 *                     visible:
 *                       type: boolean
 *                       description: Whether element should be visible for waitForElement
 *                       example: true
 *                     attributes:
 *                       type: object
 *                       description: Attributes to check for waitForElement
 *                       example: {"attribute": "value"}
 *                     properties:
 *                       type: object
 *                       description: Properties to check for waitForElement
 *                       example: {}
 *                     assertedEvents:
 *                       type: array
 *                       description: Expected events after step execution
 *                       items:
 *                         type: object
 *                         properties:
 *                           type:
 *                             type: string
 *                             description: Type of event
 *                             example: "navigation"
 *                           url:
 *                             type: string
 *                             description: Expected URL after event
 *                             example: "https://www.amazon.com/dp/B00IJ0ALYS"
 *                           title:
 *                             type: string
 *                             description: Expected page title after event
 *                             example: "Product Page"
 *     responses:
 *       200:
 *         description: Scraping completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     catch:
 *                       type: object
 *                       example: {
 *                         "money": "26 TL",
 *                         "name": "Whiskas Pouch Kuzulu Yetişkin Kedi Maması 85 G"
 *                       }
 *                       description: Scraped data based on provided selectors
 *                     screenshotUrl:
 *                       type: string
 *                       description: URL to the success screenshot if successScreenshot was enabled
 *                       example: "http://localhost:3000/tmp/success-2025-04-21T14-32-48.png"
 *       400:
 *         description: Invalid request parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "ValidationError: 'title' is required. 'titles' is not allowed"
 *                     stack:
 *                       type: array
 *                       items:
 *                         type: string
 *       500:
 *         description: Server error during scraping operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Protocol error (Emulation.setDeviceMetricsOverride): Invalid parameters Failed to deserialize params.width - BINDINGS: int32 value expected at position 22"
 *                     stack:
 *                       type: array
 *                       items:
 *                         type: string
 */
router.post("/", controllerScraper);

/**
 * @swagger
 * /app-shutdown:
 *   post:
 *     summary: Shuts down the application
 *     description: Terminates the current application process
 *     tags: [General]
 *     security:
 *       - basicAuth: []
 *     responses:
 *       200:
 *         description: Application shutdown initiated successfully
 *       500:
 *         description: Server error during shutdown
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "lorem is not a function"
 *                     stack:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: [
 *                         "string",
 *                       ]
 */
router.post("/app-shutdown", controllerAppShutdown);

/**
 * @swagger
 * /os-restart:
 *   post:
 *     summary: Restarts the operating system
 *     description: Initiates an operating system restart
 *     tags: [General]
 *     security:
 *       - basicAuth: []
 *     responses:
 *       200:
 *         description: OS restart initiated successfully
 *       500:
 *         description: Server error during restart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "lorem is not a function"
 *                     stack:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: [
 *                         "string",
 *                       ]
 */
router.post("/os-restart", controllerOsRestart);

// Export the router for use in the main application
export default router;