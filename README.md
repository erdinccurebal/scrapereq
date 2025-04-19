# Req-Scrap

A powerful and flexible web scraping API built with Express.js and Puppeteer.

## Overview

Req-Scrap is a RESTful API service that allows you to perform web scraping operations by defining a series of steps that are executed by a headless browser. It provides a clean and secure way to extract data from websites with advanced features like proxy support, customizable scraping speeds, and robust error handling.

## Features

- **Step-Based Scraping**: Define your scraping workflow as a series of steps (navigate, click, wait, etc.)
- **Speed Control**: Multiple speed modes to control execution pace (TURBO, FAST, NORMAL, SLOW, etc.)
- **Proxy Support**: Configure proxies with authentication for web requests
- **Security**: Built-in basic authentication, helmet protection, and CORS configuration
- **Reliability**: Comprehensive error handling and health check endpoints
- **Customizable**: Adjustable timeouts and browser configurations
- **API Monitoring**: Detailed health check endpoint with system information

## Tech Stack

- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **Puppeteer**: Headless Chrome browser automation
- **@puppeteer/replay**: Record and replay browser interactions
- **Joi**: Request validation
- **Morgan**: HTTP request logging
- **Helmet**: Security middleware
- **CORS**: Cross-Origin Resource Sharing support
- **dotenv**: Environment configuration

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/req-scrap.git
cd req-scrap
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory (optional for custom configuration):
```
PORT=3000
HOST=localhost
NODE_ENV=development
AUTH_USERNAME=admin
AUTH_PASSWORD=secretpassword
```

4. Start the application:
```bash
npm start
```

## API Endpoints

### Health Check
```
GET /health
```
Returns detailed system information and checks if all components are working correctly.

### Scraper
```
POST /
```
Main endpoint for web scraping operations.

#### Request Body Example
```json
{
  "title": "Google Search Example",
  "speedMode": "NORMAL",
  "timeoutMode": "NORMAL",
  "steps": [
    {
      "type": "navigate",
      "url": "https://www.google.com"
    },
    {
      "type": "click",
      "selectors": [".search-input"]
    },
    {
      "type": "wait",
      "value": "1000"
    }
  ],
  "proxy": {
    "enabled": false,
    "server": "proxy.example.com",
    "port": 8080,
    "username": "user",
    "password": "pass",
    "protocol": "http"
  }
}
```

## Authentication

The API is secured with basic authentication. Default credentials:
- Username: `admin`
- Password: `admin`

You can change these values in the `.env` file or in constants.js.

## Configuration

The application can be configured through:
- Environment variables (`.env` file)
- Constants defined in `constants.js`

Key configuration options:
- Speed modes for controlling scraping pace
- Timeout values for operations
- Browser settings (user agent, headless mode, etc.)
- Proxy settings
- API security settings

## Project Structure

```
.
├── app.js                # Express application setup
├── constants.js          # Application constants
├── index.js              # Entry point
├── routes.js             # API route definitions
├── controllers/          # Request handlers
│   ├── error-handler.js  # Error handling middleware
│   ├── health.js         # Health check endpoint
│   ├── scraper.js        # Main scraping controller
│   └── route-not-found-handler.js
├── helpers/              # Utility functions
│   ├── filter-steps.js   # Process scraping steps
│   ├── puppeteer-health.js # Browser health checks
│   ├── setup-proxy-auth.js # Proxy configuration
│   └── validators.js     # Request validation schemas
└── tmp/                  # Temporary files
```

## License

ISC License

## Author

Erdinç Cürebal