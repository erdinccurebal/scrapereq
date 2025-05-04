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
 *     summary: Checks system status and health
 *     description: Verifies that API is operational and returns detailed system information
 *     tags: [App]
 *     security:
 *       - basicAuth: []
 *     responses:
 *       200:
 *         description: API is working properly
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
 *         description: System error occurred
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
 *                       example: "Internal server error occurred"
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
router.get('/health', controllerApiAppHealth);

/**
 * @swagger
 * /api/app/shutdown:
 *   post:
 *     summary: Shuts down the application
 *     description: Terminates the current application process with a configurable delay
 *     tags: [App]
 *     security:
 *       - basicAuth: []
 *     responses:
 *       200:
 *         description: Application shutdown initiated successfully
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
 *                       example: "Application is shutting down in 3 seconds..."
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
 *                       example: "Error initiating shutdown process"
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
router.post('/shutdown', controllerApiAppShutdown);

// Export the router for use in the application
export const routerApiApp = router;
