/**
 * Browser Semaphore Helper
 * Provides a centralized mechanism to ensure only one browser instance is active at a time
 * All browser requests are queued and processed sequentially
 */

// Browser semaphore mechanism for all browser operations across the application
export const helperBrowserSemaphore = {
    /**
     * Indicates whether a browser operation is currently in progress
     * @type {boolean}
     */
    isLocked: false,
    
    /**
     * Queue for pending browser operation requests
     * @type {Array<Function>}
     */
    queue: [],
    
    /**
     * Acquires the browser lock for an operation
     * If the browser is already in use, adds the request to the queue
     * @returns {Promise<void>} - Resolves when the lock is acquired
     */
    async acquire() {
        return new Promise(resolve => {
            if (!this.isLocked) {
                this.isLocked = true;
                console.log('Browser lock acquired.');
                resolve();
            } else {
                console.log('Browser is busy. Request added to queue.');
                this.queue.push(resolve);
            }
        });
    },
    
    /**
     * Releases the browser lock
     * If there are pending requests in the queue, grants access to the next request
     * Otherwise, completely releases the lock
     */
    release() {
        if (this.queue.length > 0) {
            const nextResolve = this.queue.shift();
            console.log('Releasing browser lock to next request in queue.');
            nextResolve();
        } else {
            this.isLocked = false;
            console.log('Browser lock released. No pending requests.');
        }
    }
};
