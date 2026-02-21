// Node third-party modules
import express from 'express';

// Controller imports
import { controllerApiScrapeStart } from '../../controllers/api/scrape/start.js';
import { controllerApiScrapeTest } from '../../controllers/api/scrape/test.js';

// Initialize Express Router
const router = express.Router();

/**
 * @swagger
 * /api/scrape/start:
 *   post:
 *     summary: Execute web scraping operations
 *     description: |
 *       Perform web scraping based on defined steps and selectors.
 *       Supports proxy configuration, different response formats, and customizable browser behavior.
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
 *               - proxy
 *               - record
 *             properties:
 *               proxy:
 *                 type: object
 *                 required:
 *                   - auth
 *                   - servers
 *                 properties:
 *                   bypassCode:
 *                     type: string
 *                     description: Password to bypass proxy requirement
 *                   auth:
 *                     type: object
 *                     properties:
 *                       enabled:
 *                         type: boolean
 *                         example: false
 *                       username:
 *                         type: string
 *                       password:
 *                         type: string
 *                   servers:
 *                     type: array
 *                     items:
 *                       type: object
 *                       required: [server, port]
 *                       properties:
 *                         server:
 *                           type: string
 *                           example: "proxy.example.com"
 *                         port:
 *                           type: integer
 *                           minimum: 1
 *                           maximum: 65535
 *                           example: 8080
 *                         protocol:
 *                           type: string
 *                           enum: [HTTP, HTTPS, SOCKS4, SOCKS5]
 *                           default: HTTP
 *               record:
 *                 type: object
 *                 required: [title, steps]
 *                 properties:
 *                   title:
 *                     type: string
 *                     example: "Product Scraper"
 *                   speedMode:
 *                     type: string
 *                     enum: [TURBO, FAST, NORMAL, SLOW, SLOWEST, CRAWL, STEALTH]
 *                     default: NORMAL
 *                   timeoutMode:
 *                     type: string
 *                     enum: [SHORT, NORMAL, LONG]
 *                     default: NORMAL
 *                   steps:
 *                     type: array
 *                     description: Sequence of browser actions. At least one navigate step required.
 *                     items:
 *                       type: object
 *                       required: [type]
 *                       properties:
 *                         type:
 *                           type: string
 *                           enum: [navigate, click, wait, setViewport, change, waitForElement]
 *                         url:
 *                           type: string
 *                           format: uri
 *                         value:
 *                           type: string
 *                         selectors:
 *                           type: array
 *                         width:
 *                           type: number
 *                         height:
 *                           type: number
 *                         duration:
 *                           type: number
 *                         timeout:
 *                           type: number
 *               capture:
 *                 type: object
 *                 properties:
 *                   selectors:
 *                     type: array
 *                     description: |
 *                       Data extraction selectors. Required for JSON (1+) and RAW (exactly 1).
 *                       Only one FULL type selector allowed.
 *                     items:
 *                       type: object
 *                       required: [key, type, value]
 *                       properties:
 *                         key:
 *                           type: string
 *                           example: "price"
 *                         type:
 *                           type: string
 *                           enum: [CSS, XPATH, FULL]
 *                         value:
 *                           type: string
 *                           example: "#productTitle"
 *               headers:
 *                 type: object
 *                 properties:
 *                   Accept-Language:
 *                     type: string
 *                     default: "en-US,en;q=0.9"
 *                   User-Agent:
 *                     type: string
 *               output:
 *                 type: object
 *                 properties:
 *                   screenshots:
 *                     type: object
 *                     properties:
 *                       onError:
 *                         type: boolean
 *                         default: true
 *                       onSuccess:
 *                         type: boolean
 *                         default: false
 *                   responseType:
 *                     type: string
 *                     enum: [NONE, JSON, RAW]
 *                     default: JSON
 *                     description: |
 *                       - NONE: Returns success status only
 *                       - JSON: Structured response with all selector results
 *                       - RAW: Raw content from the single selector
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
 *                       description: Scraped data keyed by selector key
 *                     screenshotUrl:
 *                       type: string
 *                     proxy:
 *                       type: object
 *                       properties:
 *                         server:
 *                           type: string
 *                         port:
 *                           type: number
 *                         protocol:
 *                           type: string
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized - authentication or proxy requirements not met
 *       500:
 *         description: Server error during scraping
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

// Export the router for use in the application
export const routerApiScrape = router;
