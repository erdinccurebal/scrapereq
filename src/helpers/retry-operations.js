/**
 * Enhanced Error Handling and Retry Helper
 * 
 * Provides utility functions for handling common scraping errors
 * and implementing retry mechanisms for fragile operations
 */

/**
 * Retry a function with exponential backoff
 * 
 * @param {Function} fn - Async function to retry
 * @param {Object} options - Retry options
 * @param {number} options.maxRetries - Maximum number of retry attempts (default: 3)
 * @param {number} options.initialDelay - Initial delay in ms before first retry (default: 1000)
 * @param {number} options.maxDelay - Maximum delay in ms between retries (default: 10000)
 * @param {Function} options.shouldRetry - Function to determine if a specific error should trigger retry
 * @returns {Promise<any>} - Result of the function call
 */
export async function helperRetryOperation(fn, options = {}) {
  const maxRetries = options.maxRetries || 3
  const initialDelay = options.initialDelay || 1000
  const maxDelay = options.maxDelay || 10000
  const shouldRetry = options.shouldRetry || (() => true)

  let lastError
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      
      // Check if we should retry based on the error
      if (attempt >= maxRetries || !shouldRetry(error)) {
        throw error
      }
      
      // Calculate delay with exponential backoff and jitter
      const delay = Math.min(
        initialDelay * Math.pow(2, attempt) + Math.random() * 1000,
        maxDelay
      )
      
      console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${Math.round(delay)}ms: ${error.message}`)
      
      // Wait before the next retry
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  // This should never happen, but TypeScript might complain without it
  throw lastError
}

/**
 * Common error detection functions for scraping operations
 */
export const helperErrorDetectors = {
  /**
   * Detects network-related errors that might be temporary
   * @param {Error} error - The error to check
   * @returns {boolean} - True if the error is likely a temporary network issue
   */
  isNetworkError(error) {
    const message = error.message.toLowerCase()
    return (
      message.includes('net::') ||
      message.includes('network') ||
      message.includes('connection') ||
      message.includes('timeout') ||
      error.name === 'TimeoutError'
    )
  },
  
  /**
   * Detects if the page has been redirected to a captcha page
   * @param {string} url - The current URL
   * @param {string} content - The page content
   * @returns {boolean} - True if a captcha is detected
   */
  isCaptchaDetected(url, content) {
    // Common captcha providers and patterns
    return (
      url.includes('captcha') ||
      url.includes('challenge') ||
      url.includes('security-check') ||
      content.includes('captcha') ||
      content.includes('security check') ||
      content.includes('verify you are human') ||
      content.includes('robot')
    )
  },
  
  /**
   * Detects browser disconnection errors
   * @param {Error} error - The error to check
   * @returns {boolean} - True if the error indicates browser disconnection
   */
  isBrowserDisconnected(error) {
    const message = error.message.toLowerCase()
    return (
      message.includes('browser') && 
      (message.includes('disconnect') || 
       message.includes('close') || 
       message.includes('not connect'))
    )
  }
}