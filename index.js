// Load environment variables from .env file
import 'dotenv/config';

// Node modules
import http from 'http';

// Web server application
import app from './app.js';

// Set server port from environment variables or use default
const PORT = process.env.PORT || 3000;

// Create HTTP server using our Express application
const server = http.createServer(app);

// Start the server and log when ready
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  console.log(`${new Date().toISOString()} - System ready`);
});

// Global error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});

// Global error handling for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled promise rejection:', reason);
});