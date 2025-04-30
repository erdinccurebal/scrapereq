/**
 * Application Entry Point
 * 
 * This file initializes and starts the HTTP server for the application.
 * Sets up environment variables, server configuration, and scheduled tasks.
 */

// Load environment variables from .env file
import 'dotenv/config';

// Node core modules
import http from 'http';

// Helpers
import { helperCleanupOldScreenshots } from './src/helpers/cleanup-screenshots.js';

/**
 * Set default environment variables if not already defined
 * These provide fallback values for critical configuration
 */

// Set default port if not specified in environment variables
if (!process.env.PORT) {
  process.env.PORT = 3000;
}

// Set default host if not specified in environment variables
if (!process.env.HOST) {
  process.env.HOST = 'localhost';
}

// Set default environment if not specified in environment variables
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

// Web server application
import { expressApp } from './src/app.js';

// Destructure environment variables for easier access
const { PORT, HOST, NODE_ENV } = process.env;

/**
 * Configure Express application settings
 * These settings are available via app.get('setting') throughout the application
 */
expressApp.set('env', NODE_ENV); // Set the environment in the app
expressApp.set('port', PORT); // Set the port in the app
expressApp.set('host', HOST); // Set the host in the app

/**
 * Create HTTP server using our Express application
 * This allows for potential future upgrades (like WebSockets) without changing the app
 */
const server = http.createServer(expressApp);

/**
 * Start the server and initialize scheduled tasks
 * Listens on the specified port and host
 */
server.listen(PORT, HOST, async () => {
  console.log(`Server started on port http://${HOST}:${PORT} in ${NODE_ENV} mode.`);

  /**
   * Initial screenshot cleanup on server start
   * Removes old screenshot files that may have accumulated while the server was offline
   */
  try {
    const { deleted } = await helperCleanupOldScreenshots();
    if (deleted > 0) {
      console.log(`Initial cleanup: Removed ${deleted} old screenshot files`);
    } else {
      console.log('Initial cleanup: No old screenshot files to remove');
    }
  } catch (error) {
    console.error('Error during initial screenshot cleanup:', error);
  }

  /**
   * Set up scheduled cleanup to run periodically
   * Automatically removes old screenshot files to prevent disk space issues
   * Runs every hour to maintain disk space without excessive processing
   */
  setInterval(async () => {
    try {
      const { deleted } = await helperCleanupOldScreenshots();
      if (deleted > 0) {
        console.log(`Scheduled cleanup: Removed ${deleted} old screenshot files`);
      }
    } catch (error) {
      console.error('Error during scheduled screenshot cleanup:', error);
    }
  }, 60 * 60 * 1000); // Run every 1 hour
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