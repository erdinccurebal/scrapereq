#!/usr/bin/env node

/**
 * Scrapereq CLI Startup Script
 *
 * A user-friendly CLI tool to help developers get started with the Scrapereq API
 * Provides commands for development, testing, and deployment
 */

// Node core modules
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Helper to print colored messages
const print = {
  info: msg => console.log(`${colors.blue}${colors.bright}ℹ ${colors.reset}${msg}`),
  success: msg => console.log(`${colors.green}${colors.bright}✓ ${colors.reset}${msg}`),
  warning: msg => console.log(`${colors.yellow}${colors.bright}⚠ ${colors.reset}${msg}`),
  error: msg => console.log(`${colors.red}${colors.bright}✗ ${colors.reset}${msg}`),
  header: msg => console.log(`\n${colors.cyan}${colors.bright}${msg}${colors.reset}\n`)
};

// Check if a command exists in the path
function commandExists(command) {
  try {
    // Use spawn to check if command exists
    const childProcess = spawn(command, ['--version'], { stdio: 'ignore' });

    // Set up promise to handle process completion or error
    return new Promise(resolve => {
      childProcess.on('error', () => resolve(false));
      childProcess.on('close', code => resolve(code === 0));
    });
  } catch (_error) {
    return Promise.resolve(false);
  }
}

// Create .env file if it doesn't exist
function setupEnvFile() {
  const envPath = path.join(__dirname, '.env');
  const envExamplePath = path.join(__dirname, '.env.example');

  if (!fs.existsSync(envPath)) {
    print.info('Creating .env file from .env.example...');
    try {
      fs.copyFileSync(envExamplePath, envPath);
      print.success('.env file created successfully');
    } catch (error) {
      print.error(`Failed to create .env file: ${error.message}`);
      process.exit(1);
    }
  } else {
    print.info('.env file already exists');
  }
}

// Check if tmp directory exists and create it if needed
function checkTmpDirectory() {
  const tmpDir = path.join(__dirname, 'tmp');

  if (!fs.existsSync(tmpDir)) {
    print.info('Creating tmp directory for screenshots...');
    try {
      fs.mkdirSync(tmpDir);
      print.success('tmp directory created');
    } catch (error) {
      print.error(`Failed to create tmp directory: ${error.message}`);
    }
  }
}

/**
 * Command to run the application in development mode
 */
function runDev() {
  print.header('Starting Scrapereq in development mode');
  print.info('Running with file watching enabled');

  // Check and setup environment
  setupEnvFile();
  checkTmpDirectory();

  // Create environment variables for the child process
  const env = Object.assign({}, process.env, { NODE_ENV: 'development' });

  // Run the application with file watching
  const childProcess = spawn('node', ['--watch', 'index.js'], {
    stdio: 'inherit',
    env: env
  });

  childProcess.on('error', error => {
    print.error(`Failed to start application: ${error.message}`);
  });
}

// Command to run the application in production mode
function runProd() {
  print.header('Starting Scrapereq in production mode');

  // Check and setup environment
  setupEnvFile();
  checkTmpDirectory();

  // Create environment variables for the child process
  const env = Object.assign({}, process.env, { NODE_ENV: 'production' });

  // Run the application
  const childProcess = spawn('node', ['index.js'], {
    stdio: 'inherit',
    env: env
  });

  childProcess.on('error', error => {
    print.error(`Failed to start application: ${error.message}`);
  });
}

// Command to run tests
function runTests() {
  print.header('Running Scrapereq tests');

  // Run tests with Jest
  const childProcess = spawn(
    'node',
    ['--experimental-vm-modules', 'node_modules/jest/bin/jest.js'],
    {
      stdio: 'inherit'
    }
  );

  childProcess.on('error', error => {
    print.error(`Failed to run tests: ${error.message}`);
  });
}

// Command to build and run with Docker
function runDocker() {
  print.header('Starting Scrapereq with Docker');

  // Check if Docker is installed
  if (!commandExists('docker')) {
    print.error('Docker not found. Please install Docker to use this feature.');
    process.exit(1);
  }

  print.info('Building Docker image...');
  const buildProcess = spawn('docker', ['build', '-t', 'scrapereq', '.'], { stdio: 'inherit' });

  buildProcess.on('close', code => {
    if (code !== 0) {
      print.error('Docker build failed');
      return;
    }

    print.success('Docker image built successfully');
    print.info('Starting Docker container...');

    // Run the Docker container
    const runProcess = spawn(
      'docker',
      ['run', '-p', '3000:3000', '--name', 'scrapereq-container', '-d', 'scrapereq'],
      { stdio: 'inherit' }
    );

    runProcess.on('close', code => {
      if (code !== 0) {
        print.error('Failed to start Docker container');
        return;
      }

      print.success('Docker container started successfully');
      print.info('Scrapereq is now available at http://localhost:3000');
    });
  });
}

// Display help information
function showHelp() {
  print.header('Scrapereq CLI');
  console.log(`
  ${colors.bright}Usage:${colors.reset}
    npm start [command]

  ${colors.bright}Available Commands:${colors.reset}
    dev       Start in development mode with auto-reload (default)
    prod      Start in production mode
    test      Run tests
    docker    Build and run with Docker
    help      Show this help information

  ${colors.bright}Examples:${colors.reset}
    npm start dev
    npm start prod
    npm start test

  ${colors.bright}Documentation:${colors.reset}
    API docs available at http://localhost:3000/api/docs after starting
  `);
}

// Main function
function main() {
  // Get command from arguments
  const args = process.argv.slice(2);
  const command = args[0] || 'dev';

  // Execute the appropriate command
  switch (command) {
    case 'dev':
      runDev();
      break;
    case 'prod':
      runProd();
      break;
    case 'test':
      runTests();
      break;
    case 'docker':
      runDocker();
      break;
    case 'help':
      showHelp();
      break;
    default:
      print.error(`Unknown command: ${command}`);
      showHelp();
      process.exit(1);
  }
}

// Execute the main function
main();
