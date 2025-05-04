/**
 * Browser Semaphore Helper
 *
 * Provides a centralized mechanism to manage concurrent browser instances
 * All browser requests are queued and processed based on available slots
 */

// Configuration - can be moved to environment variables
const MAX_CONCURRENT_BROWSERS = process.env.MAX_CONCURRENT_BROWSERS
  ? parseInt(process.env.MAX_CONCURRENT_BROWSERS, 10)
  : 1;

// Browser semaphore mechanism with support for configurable concurrency
export const helperBrowserSemaphore = {
  /**
   * Current number of active browser operations
   * @type {number}
   */
  activeOperations: 0,

  /**
   * Queue for pending browser operation requests
   * @type {Array<Function>}
   */
  queue: [],

  /**
   * Statistics for monitoring
   */
  stats: {
    totalAcquired: 0,
    totalReleased: 0,
    maxQueueLength: 0,
    totalWaitTime: 0,
    requests: 0
  },

  /**
   * Acquires a browser slot for an operation
   * If all slots are in use, adds the request to the queue
   * @returns {Promise<void>} - Resolves when a slot is acquired
   */
  async acquire() {
    const startTime = Date.now();
    this.stats.requests++;

    return new Promise(resolve => {
      if (this.activeOperations < MAX_CONCURRENT_BROWSERS) {
        this.activeOperations++;
        this.stats.totalAcquired++;
        console.log(
          `Browser slot acquired. Active: ${this.activeOperations}/${MAX_CONCURRENT_BROWSERS}`
        );
        resolve();
      } else {
        console.log(
          `All browser slots busy. Request added to queue. Queue length: ${this.queue.length + 1}`
        );
        this.queue.push(() => {
          const waitTime = Date.now() - startTime;
          this.stats.totalWaitTime += waitTime;
          console.log(`Request from queue acquired a browser slot after ${waitTime}ms wait`);
          this.activeOperations++;
          this.stats.totalAcquired++;
          resolve();
        });

        // Update max queue length statistic
        this.stats.maxQueueLength = Math.max(this.stats.maxQueueLength, this.queue.length);
      }
    });
  },

  /**
   * Releases a browser slot
   * If there are pending requests in the queue, grants access to the next request
   * @returns {void}
   */
  release() {
    this.stats.totalReleased++;

    if (this.queue.length > 0) {
      const nextResolve = this.queue.shift();
      console.log(
        `Releasing browser slot to next request in queue. Queue length: ${this.queue.length}`
      );
      nextResolve();
    } else {
      this.activeOperations--;
      console.log(
        `Browser slot released. Active: ${this.activeOperations}/${MAX_CONCURRENT_BROWSERS}`
      );
    }
  },

  /**
   * Get current semaphore statistics
   * @returns {Object} Current statistics
   */
  getStats() {
    return {
      ...this.stats,
      activeOperations: this.activeOperations,
      queueLength: this.queue.length,
      avgWaitTime: this.stats.requests
        ? Math.round(this.stats.totalWaitTime / this.stats.requests)
        : 0,
      timestamp: new Date().toISOString()
    };
  },

  /**
   * Reset semaphore statistics
   * @returns {Object} Previous statistics
   */
  resetStats() {
    const previousStats = { ...this.stats };

    this.stats = {
      totalAcquired: 0,
      totalReleased: 0,
      maxQueueLength: 0,
      totalWaitTime: 0,
      requests: 0
    };

    return previousStats;
  }
};
