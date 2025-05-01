// Node third-party modules
import express from 'express';

// Initialize Express Router
const router = express.Router();

// Import controllers
import { controllerApiOsRestart } from '../../controllers/api/os/restart.js';

/**
 * @swagger
 * /api/os/restart:
 *   post:
 *     summary: Restarts the operating system
 *     description: Initiates an operating system restart
 *     tags: [Os]
 *     security:
 *       - basicAuth: []
 *     responses:
 *       200:
 *         description: OS restart initiated successfully
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
 *                       example: "System restart initiated. The server will be restarted immediately and temporarily unavailable."
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
 *                     code:
 *                       type: string
 *                       description: Standardized error code for easier error handling
 *                       example: "ERROR_UNKNOWN"
 */
router.post("/restart", controllerApiOsRestart);

// Export the router for use in the application
export const routerApiOs = router;