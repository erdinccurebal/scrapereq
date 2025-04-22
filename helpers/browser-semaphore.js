/**
 * Browser Semaphore Helper
 * Provides a centralized mechanism to ensure only one browser instance is active at a time
 * All browser requests are queued and processed sequentially
 */

// Browser semaphore mechanism for all browser operations across the application
export const helperBrowserSemaphore = {
    isLocked: false,
    queue: [],
    
    // Acquire the lock
    async acquire() {
        return new Promise(resolve => {
            if (!this.isLocked) {
                this.isLocked = true;
                console.log('Browser lock acquired.');
                resolve();
            } else {
                console.log('Browser is busy. Request added to queue.');
                this.queue.push(resolve);
            };
        });
    },
    
    // Release the lock
    release() {
        if (this.queue.length > 0) {
            const nextResolve = this.queue.shift();
            console.log('Releasing browser lock to next request in queue.');
            nextResolve();
        } else {
            this.isLocked = false;
            console.log('Browser lock released. No pending requests.');
        };
    }
};
