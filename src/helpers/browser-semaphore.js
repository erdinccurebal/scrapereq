/**
 * Browser Semaphore Helper
 *
 * Provides a centralized mechanism to manage concurrent browser instances
 * All browser requests are queued and processed based on available slots
 */

import { MAX_CONCURRENT_BROWSERS } from '../constants.js';

// Configuration - can be moved to environment variables
const MAX_BROWSERS = process.env.MAX_CONCURRENT_BROWSERS
  ? parseInt(process.env.MAX_CONCURRENT_BROWSERS, 10)
  : MAX_CONCURRENT_BROWSERS;

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
   * Acquires a browser slot for an operation
   * If all slots are in use, adds the request to the queue
   * @returns {Promise<void>} - Resolves when a slot is acquired
   */
  async acquire() {
    return new Promise((resolve) => {
      if (this.activeOperations < MAX_BROWSERS) {
        this.activeOperations++;
        console.log(`Browser slot acquired. Active: ${this.activeOperations}/${MAX_BROWSERS}`);
        resolve();
      } else {
        console.log(
          `All browser slots busy. Request added to queue. Queue length: ${this.queue.length + 1}`
        );
        this.queue.push(() => {
          console.log(`Request from queue acquired a browser slot`);
          this.activeOperations++;
          resolve();
        });
      }
    });
  },

  /**
   * Releases a browser slot
   * If there are pending requests in the queue, grants access to the next request
   * @returns {void}
   */
  release() {
    if (this.queue.length > 0) {
      const nextResolve = this.queue.shift();
      console.log(
        `Releasing browser slot to next request in queue. Queue length: ${this.queue.length}`
      );
      nextResolve();
    } else {
      this.activeOperations--;
      console.log(`Browser slot released. Active: ${this.activeOperations}/${MAX_BROWSERS}`);
    }
  }
};
