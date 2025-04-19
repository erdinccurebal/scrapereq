// Load environment variables from .env file
import 'dotenv/config';

// Node modules
import http from 'http';

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
import app from './app.js';

// Destructure environment variables for easier access
const { PORT, HOST, NODE_ENV } = process.env;

app.set('env', NODE_ENV); // Set the environment in the app
app.set('port', PORT); // Set the port in the app
app.set('host', HOST); // Set the host in the app

// Create HTTP server using our Express application
const server = http.createServer(app);

// Start the server and log when ready
server.listen(PORT, HOST, () => {
  console.log(`Server started on port http://${HOST}:${PORT} in ${NODE_ENV} mode.`);
});

// Global error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});

// Global error handling for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled promise rejection:', reason);
});