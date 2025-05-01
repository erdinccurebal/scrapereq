/**
 * Metrics Controller
 * 
 * Provides endpoint to access scraping metrics
 * Useful for monitoring and debugging scraping operations
 */

// Import metrics helper
import { helperGetMetrics, helperResetMetrics } from '../../../helpers/scraping-metrics.js'

/**
 * Get metrics endpoint - GET /api/scrape/metrics handler
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with scraping metrics
 */
export function controllerApiScrapeMetrics(req, res, next) {
  try {
    // Check if detailed metrics are requested
    const detailed = req.query.detailed === 'true'
    
    // Get metrics
    const metrics = helperGetMetrics(detailed)
    
    // Return metrics
    res.json({
      success: true,
      data: metrics
    })
  } catch (error) {
    error.message = `${error.message} - Code: ERROR_API_SCRAPE_METRICS`
    next(error)
  }
}

/**
 * Reset metrics endpoint - POST /api/scrape/metrics/reset handler
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response confirming metrics reset
 */
export function controllerApiScrapeMetricsReset(req, res, next) {
  try {
    // Reset all metrics
    helperResetMetrics()
    
    // Return confirmation
    res.json({
      success: true,
      data: {
        message: 'Scraping metrics have been reset'
      }
    })
  } catch (error) {
    error.message = `${error.message} - Code: ERROR_API_SCRAPE_METRICS_RESET`
    next(error)
  }
}