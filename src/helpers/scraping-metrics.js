/**
 * Scraping Performance Monitoring Helper
 * 
 * Provides functionality to track and report scraping operation metrics
 * Useful for monitoring efficiency, detecting bottlenecks, and optimizing performance
 */

// Create a metrics store to hold scraping performance data
const scrapingMetrics = {
  operations: 0,
  successful: 0,
  failed: 0,
  averageDuration: 0,
  totalDuration: 0,
  byProxy: {},
  byUrl: {},
  byResponseType: {},
  errors: {},
  recent: []
}

/**
 * Records metrics for a scraping operation
 * 
 * @param {Object} metrics - Operation metrics
 * @param {boolean} metrics.success - Whether the operation was successful
 * @param {number} metrics.duration - Duration of the operation in ms
 * @param {string} metrics.url - The URL that was scraped
 * @param {string} metrics.responseType - The response type used
 * @param {string} [metrics.proxy] - The proxy used (if any)
 * @param {string} [metrics.error] - Error message (if operation failed)
 * @param {string} [metrics.errorCode] - Error code (if operation failed)
 * @returns {void}
 */
export function helperRecordMetrics(metrics) {
  const { success, duration, url, responseType, proxy, error, errorCode } = metrics
  
  // Update overall metrics
  scrapingMetrics.operations++
  scrapingMetrics.totalDuration += duration
  scrapingMetrics.averageDuration = scrapingMetrics.totalDuration / scrapingMetrics.operations
  
  if (success) {
    scrapingMetrics.successful++
  } else {
    scrapingMetrics.failed++
    
    // Track error types
    const errorType = errorCode || 'unknown'
    scrapingMetrics.errors[errorType] = (scrapingMetrics.errors[errorType] || 0) + 1
  }
  
  // Track by URL patterns (domain level)
  try {
    const domain = new URL(url).hostname
    // Use object spread to create or update domain metrics
    scrapingMetrics.byUrl[domain] = {
      count: (scrapingMetrics.byUrl[domain]?.count || 0) + 1,
      successful: (scrapingMetrics.byUrl[domain]?.successful || 0) + (success ? 1 : 0),
      failed: (scrapingMetrics.byUrl[domain]?.failed || 0) + (!success ? 1 : 0)
    }
  } catch (e) {
    console.error(`Invalid URL in metrics: ${url}`)
  }
  
  // Track by response type - use object spread for cleaner code
  scrapingMetrics.byResponseType[responseType] = {
    count: (scrapingMetrics.byResponseType[responseType]?.count || 0) + 1,
    successful: (scrapingMetrics.byResponseType[responseType]?.successful || 0) + (success ? 1 : 0),
    failed: (scrapingMetrics.byResponseType[responseType]?.failed || 0) + (!success ? 1 : 0)
  }
  
  // Track by proxy - only if proxy is provided
  if (proxy) {
    scrapingMetrics.byProxy[proxy] = {
      count: (scrapingMetrics.byProxy[proxy]?.count || 0) + 1,
      successful: (scrapingMetrics.byProxy[proxy]?.successful || 0) + (success ? 1 : 0),
      failed: (scrapingMetrics.byProxy[proxy]?.failed || 0) + (!success ? 1 : 0)
    }
  }
  
  // Keep recent operations history (last 100)
  const recentOperation = {
    timestamp: new Date().toISOString(),
    success,
    duration,
    url,
    responseType,
    proxy,
    ...(success ? {} : { error, errorCode }) // Conditionally add error properties
  }
  
  scrapingMetrics.recent.unshift(recentOperation)
  if (scrapingMetrics.recent.length > 100) {
    scrapingMetrics.recent.pop()
  }
}

/**
 * Get current scraping metrics
 * 
 * @param {boolean} [detailed=false] - Whether to include detailed metrics
 * @returns {Object} Current metrics
 */
export function helperGetMetrics(detailed = false) {
  const baseMetrics = {
    operations: scrapingMetrics.operations,
    successful: scrapingMetrics.successful,
    failed: scrapingMetrics.failed,
    successRate: scrapingMetrics.operations ? 
      `${(scrapingMetrics.successful / scrapingMetrics.operations * 100).toFixed(2)}%` : '0%',
    averageDuration: `${Math.round(scrapingMetrics.averageDuration)}ms`,
    timestamp: new Date().toISOString()
  }
  
  if (!detailed) {
    return baseMetrics
  }
  
  return {
    ...baseMetrics,
    byResponseType: scrapingMetrics.byResponseType,
    byProxy: scrapingMetrics.byProxy,
    errors: scrapingMetrics.errors,
    recent: scrapingMetrics.recent.slice(0, 10) // Return only the 10 most recent operations
  }
}

/**
 * Reset all scraping metrics
 * 
 * @returns {Object} The previous metrics before reset
 */
export function helperResetMetrics() {
  // Store previous metrics for potential logging or return
  const previousMetrics = { ...scrapingMetrics }
  
  // Reset all metrics
  scrapingMetrics.operations = 0
  scrapingMetrics.successful = 0
  scrapingMetrics.failed = 0
  scrapingMetrics.averageDuration = 0
  scrapingMetrics.totalDuration = 0
  scrapingMetrics.byProxy = {}
  scrapingMetrics.byUrl = {}
  scrapingMetrics.byResponseType = {}
  scrapingMetrics.errors = {}
  scrapingMetrics.recent = []
  
  return previousMetrics
}