/**
 * Application Entry Point
 * 
 * This file initializes and starts the HTTP server for the application.
 * Sets up environment variables, server configuration, and scheduled tasks.
 */

// Load environment variables from .env file and initialize config
import { config } from './src/config.js';

// Node core modules
import http from 'http';

// Helpers
import { helperCleanupOldScreenshots } from './src/helpers/cleanup-screenshots.js';

// Web server application
import { expressApp } from './src/app.js';

/**
 * Configure Express application settings
 * These settings are available via app.get('setting') throughout the application
 */
expressApp.set('env', config.server.env); // Set the environment in the app
expressApp.set('port', config.server.port); // Set the port in the app
expressApp.set('host', config.server.host); // Set the host in the app

/**
 * Create HTTP server using our Express application
 * This allows for potential future upgrades (like WebSockets) without changing the app
 */
const server = http.createServer(expressApp);

/**
 * Schedule screenshot cleanup task
 * Runs every hour to clean up old screenshots and prevent disk space issues
 * 
 * @returns {Promise<void>} Promise that resolves when the cleanup is complete
 */
async function scheduleScreenshotCleanup() {
  try {
    const { deleted } = await helperCleanupOldScreenshots();
    if (deleted > 0) {
      console.log(`Scheduled cleanup: Removed ${deleted} old screenshot files`);
    }
  } catch (error) {
    console.error('Error during scheduled screenshot cleanup:', error);
  }
  
  // Schedule next cleanup
  setTimeout(scheduleScreenshotCleanup, 60 * 60 * 1000); // Run every 1 hour
}

/**
 * Start the server and initialize scheduled tasks
 * Listens on the specified port and host
 */
server.listen(config.server.port, config.server.host, async () => {
  console.log(`Server started on port http://${config.server.host}:${config.server.port} in ${config.server.env} mode.`);

  // Perform initial screenshot cleanup
  try {
    const { deleted } = await helperCleanupOldScreenshots();
    if (deleted > 0) {
      console.log(`Initial cleanup: Removed ${deleted} old screenshot files`);
    } else {
      console.log('Initial cleanup: No old screenshot files to remove');
    }
    
    // Start the scheduled cleanup
    setTimeout(scheduleScreenshotCleanup, 60 * 60 * 1000);
  } catch (error) {
    console.error('Error during initial screenshot cleanup:', error);
  }
});

/**
 * Global error handling for uncaught exceptions
 * Prevents the server from crashing when unexpected errors occur
 */
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});

/**
 * Global error handling for unhandled promise rejections
 * Prevents the server from crashing when promises are rejected without a catch handler
 */
process.on('unhandledRejection', (reason, _promise) => {
  console.error('Unhandled promise rejection:', reason);
});

/**
 * Graceful shutdown handlers
 * Ensures the server closes cleanly on termination signals
 * Allows pending requests to complete before shutting down
 */
process.on('SIGTERM', gracefulShutdown('SIGTERM'));
process.on('SIGINT', gracefulShutdown('SIGINT'));

/**
 * Graceful shutdown function
 * Closes server and exits process after completing pending connections
 * @param {string} signal - The signal that triggered the shutdown
 * @returns {Function} - Signal handler function
 */
function gracefulShutdown(signal) {
  return () => {
    console.log(`${signal} received. Starting graceful shutdown...`);
    
    server.close(() => {
      console.log('Server closed. All connections were properly ended.');
      process.exit(0);
    });
    
    // Force shutdown after 10 seconds if connections haven't closed
    setTimeout(() => {
      console.warn('Forcing server shutdown after timeout.');
      process.exit(1);
    }, 10000);
  };
}