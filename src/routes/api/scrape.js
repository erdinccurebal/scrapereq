// Node third-party modules
import express from 'express';

// Controller imports
import { controllerApiScrapeStart } from '../../controllers/api/scrape/start.js';
import { controllerApiScrapeTest } from '../../controllers/api/scrape/test.js';
import {
  controllerApiScrapeMetrics,
  controllerApiScrapeMetricsReset
} from '../../controllers/api/scrape/metrics.js';

// Initialize Express Router
const router = express.Router();

/**
 * @swagger
 * /api/scrape/start:
 *   post:
 *     summary: Execute web scraping operations
 *     description: Perform web scraping based on defined steps and selectors
 *     tags: [Scrape]
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
 *                 description: |
 *                   Output format of the scraped data:
 *                   - NONE: No data is returned (for background operations)
 *                   - JSON: Returns structured JSON with success status, data, proxy info, screenshots
 *                   - RAW: Returns raw content directly from the first selector without any wrapping structure
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
 *               accessPasswordWithoutProxy:
 *                 type: string
 *                 description: Password to allow requests without proxy
 *                 example: "secure_password_123"
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
 *                 description: |
 *                   Data extraction selector configurations for scraping.
 *                   - Required when responseType is not NONE, forbidden when responseType is NONE
 *                   - When responseType is RAW, only one selector is allowed and its content will be returned directly
 *                   - When responseType is JSON, all selectors will be processed and returned in a structured format
 *                   - Only one selector with type FULL is allowed
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
 *               proxyAuth:
 *                 type: object
 *                 description: Proxy authentication settings
 *                 required:
 *                   - enabled
 *                   - username
 *                   - password
 *                 properties:
 *                   enabled:
 *                     type: boolean
 *                     description: Enable/disable proxy authentication (required)
 *                     example: true
 *                   username:
 *                     type: string
 *                     description: Proxy authentication username (required when enabled is true)
 *                     example: "username"
 *                   password:
 *                     type: string
 *                     description: Proxy authentication password (required when enabled is true)
 *                     example: "password"
 *               proxies:
 *                 type: array
 *                 description: Array of proxy configurations for web requests
 *                 items:
 *                   type: object
 *                   required:
 *                     - server
 *                     - port
 *                     - protocol
 *                   properties:
 *                     server:
 *                       type: string
 *                       description: Proxy server hostname or IP (required)
 *                       example: "proxy.example.com"
 *                     port:
 *                       type: number
 *                       description: Proxy server port (required)
 *                       example: 8080
 *                     protocol:
 *                       type: string
 *                       description: Proxy protocol (required)
 *                       enum: [HTTP, HTTPS, SOCKS4, SOCKS5]
 *                       example: "HTTP"
 *                 example:
 *                   - server: "proxy1.example.com"
 *                     port: 8080
 *                     protocol: "HTTP"
 *                   - server: "proxy2.example.com"
 *                     port: 8081
 *                     protocol: "HTTPS"
 *               steps:
 *                 type: array
 *                 description: |
 *                   Sequence of browser actions to perform.
 *                   Requires at least one navigate step with a valid URL.
 *                 items:
 *                   type: object
 *                   required:
 *                     - type
 *                   properties:
 *                     type:
 *                       type: string
 *                       description: Type of browser action
 *                       enum: [navigate, click, wait, setViewport, change, waitForElement]
 *                       example: "navigate"
 *                     url:
 *                       type: string
 *                       format: uri
 *                       description: URL for navigation steps
 *                       example: "https://www.amazon.com/dp/B00IJ0ALYS"
 *                     value:
 *                       type: string
 *                       description: Value to set for input fields (for change action) or URL for navigation when url is not provided
 *                       example: "search keyword"
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
 *                     offsetX:
 *                       type: number
 *                       description: X-coordinate offset for click operations
 *                       example: 28
 *                     offsetY:
 *                       type: number
 *                       description: Y-coordinate offset for click operations
 *                       example: 9
 *                     frame:
 *                       oneOf:
 *                         - type: string
 *                         - type: array
 *                           items:
 *                             type: number
 *                       description: Frame identifier for actions in iframes (string or array)
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
 *                       example: "ValidationError: 'title' is required. Selectors cannot be provided when responseType is NONE"
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
 *                     code:
 *                       type: string
 *                       description: Standardized error code for easier error handling
 *                       example: "ERROR_UNKNOWN"
 *                     screenshotUrl:
 *                       type: string
 *                       description: URL to the error screenshot if errorScreenshot was enabled
 *                       example: "http://localhost:3000/tmp/error-2025-04-21T14-35-18.png"
 *                     proxy:
 *                       type: string
 *                       description: Proxy details used during the failed request
 *                       example: "--proxy-server=http://proxy1.example.com:8080"
 */
router.post('/start', controllerApiScrapeStart);

/**
 * @swagger
 * /api/scrape/test:
 *   post:
 *     summary: Test web scraping operations
 *     description: Test web scraping configuration without executing full scrape
 *     tags: [Scrape]
 *     security:
 *       - basicAuth: []
 *     responses:
 *       200:
 *         description: Test completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       500:
 *         description: Server error during test operation
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
 *                       example: "An unexpected error occurred during test operation"
 *                     stack:
 *                       type: array
 *                       items:
 *                         type: string
 *                     code:
 *                       type: string
 *                       description: Standardized error code for easier error handling
 *                       example: "ERROR_UNKNOWN"
 */
router.post('/test', controllerApiScrapeTest);

/**
 * @swagger
 * /api/scrape/metrics:
 *   get:
 *     summary: Get scraping operation metrics
 *     description: Retrieve performance and success metrics for scraping operations
 *     tags: [Scrape]
 *     security:
 *       - basicAuth: []
 *     parameters:
 *       - in: query
 *         name: detailed
 *         schema:
 *           type: boolean
 *         description: Whether to include detailed metrics (proxy, URL, response type breakdowns)
 *     responses:
 *       200:
 *         description: Metrics retrieved successfully
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
 *                     operations:
 *                       type: number
 *                       example: 120
 *                       description: Total number of scraping operations
 *                     successful:
 *                       type: number
 *                       example: 105
 *                       description: Number of successful operations
 *                     failed:
 *                       type: number
 *                       example: 15
 *                       description: Number of failed operations
 *                     successRate:
 *                       type: string
 *                       example: "87.50%"
 *                       description: Success rate as percentage
 *                     averageDuration:
 *                       type: string
 *                       example: "1255ms"
 *                       description: Average operation duration
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-05-01T12:30:45.123Z"
 *                       description: Time when metrics were retrieved
 *       500:
 *         description: Server error retrieving metrics
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
 *                       example: "Error retrieving metrics"
 *                     code:
 *                       type: string
 *                       description: Standardized error code
 *                       example: "ERROR_API_SCRAPE_METRICS"
 */
router.get('/metrics', controllerApiScrapeMetrics);

/**
 * @swagger
 * /api/scrape/metrics/reset:
 *   post:
 *     summary: Reset scraping metrics
 *     description: Clear all collected scraping metrics and start fresh
 *     tags: [Scrape]
 *     security:
 *       - basicAuth: []
 *     responses:
 *       200:
 *         description: Metrics reset successfully
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
 *                     message:
 *                       type: string
 *                       example: "Scraping metrics have been reset"
 *       500:
 *         description: Server error resetting metrics
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
 *                       example: "Error resetting metrics"
 *                     code:
 *                       type: string
 *                       description: Standardized error code
 *                       example: "ERROR_API_SCRAPE_METRICS_RESET"
 */
router.post('/metrics/reset', controllerApiScrapeMetricsReset);

// Export the router for use in the application
export const routerApiScrape = router;
