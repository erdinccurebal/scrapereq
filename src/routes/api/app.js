// Node third-party modules
import express from 'express';

// Initialize Express Router
const router = express.Router();

// Import controllers
import { controllerApiAppHealth } from '../../controllers/api/app/health.js';
import { controllerApiAppShutdown } from '../../controllers/api/app/shutdown.js';

/**
 * @swagger
 * /api/app/health:
 *   get:
 *     summary: Checks system status
 *     description: Verifies that API is operational
 *     tags: [App]
 *     security:
 *       - basicAuth: []
 *     responses:
 *       200:
 *         description: API is working
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
 *                           example: "scrapereq"
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
 *                           example: "21s"
 *                         pid:
 *                           type: number
 *                           example: 4368
 *                     system:
 *                       type: object
 *                       properties:
 *                         timestamp:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-05-03T18:58:18.359Z"
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
 *                           example: "7096.45"
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
 *                     code:
 *                       type: string
 *                       description: Standardized error code for easier error handling
 *                       example: "ERROR_UNKNOWN"
 */
router.get("/health", controllerApiAppHealth);

/**
 * @swagger
 * /api/app/shutdown:
 *   post:
 *     summary: Shuts down the application
 *     description: Terminates the current application process
 *     tags: [App]
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
router.post("/shutdown", controllerApiAppShutdown);

// Export the router for use in the application
export const routerApiApp = router;