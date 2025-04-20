# Req-Scrap

A powerful and flexible web scraping API built with Express.js and Puppeteer.

## Overview

Req-Scrap is a RESTful API service that allows you to perform web scraping operations by defining a series of steps that are executed by a headless browser. It provides a clean and secure way to extract data from websites with advanced features like proxy support, customizable scraping speeds, and robust error handling.

## Features

- **Step-Based Scraping**: Define your scraping workflow as a series of steps (navigate, click, wait, setViewport, change, waitForElement, etc.)
- **Speed Control**: Multiple speed modes to control execution pace (TURBO, FAST, NORMAL, SLOW, SLOWEST, CRAWL, STEALTH)
- **Proxy Support**: Configure proxies with authentication for web requests
- **Security**: Built-in basic authentication, helmet protection, and CORS configuration
- **Reliability**: Comprehensive error handling and health check endpoints
- **Customizable**: Adjustable timeouts and browser configurations
- **API Documentation**: Integrated Swagger documentation
- **API Monitoring**: Detailed health check endpoint with system information
- **System Controls**: Application shutdown and OS restart endpoints

## Tech Stack

- **Node.js**: JavaScript runtime
- **Express.js v5.1.0**: Web application framework
- **Puppeteer v24.6.1**: Headless Chrome browser automation
- **@puppeteer/replay v3.1.1**: Record and replay browser interactions
- **Joi v17.13.3**: Request validation
- **Morgan**: HTTP request logging
- **Helmet v8.1.0**: Security middleware
- **Swagger**: API documentation
- **CORS**: Cross-Origin Resource Sharing support
- **dotenv v16.5.0**: Environment configuration

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
CHROME_PATH=/path/to/chrome # Optional custom Chrome path
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
Returns detailed system information and checks if all components are working correctly. Includes:
- Project metadata
- Application status and uptime
- Puppeteer browser functionality test
- System information (OS, memory, CPU)

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
  "responseType": "JSON",
  "selectors": [
    {
      "key": "search_results",
      "type": "CSS",
      "value": "#search"
    },
    {
      "key": "page_title",
      "type": "CSS",
      "value": "title"
    }
  ],
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
    },
    {
      "type": "setViewport",
      "width": 1366,
      "height": 768
    },
    {
      "type": "change",
      "selectors": [".search-input"],
      "value": "example search"
    },
    {
      "type": "waitForElement",
      "selectors": [".search-results"]
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

### System Management
```
POST /app-shutdown
```
Shuts down the application.

```
POST /os-restart
```
Initiates an operating system restart.

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

## Response Types

The scraper supports multiple response types:
- `JSON`: Returns structured JSON with success status and data
- `RAW`: Returns raw content without formatting
- `NONE`: No response content (useful for headless operations)

## Selector Types and Validation Rules

Data can be extracted using different selector methods:
- `CSS`: Standard CSS selectors
- `XPATH`: XPath expressions
- `FULL`: Retrieves the full page HTML content

Selectors validation rules:
- When `responseType` is set to `NONE`, selectors cannot be provided
- When `responseType` is set to `RAW`, only one selector can be used
- Maximum one `FULL` type selector is allowed regardless of response type
- Each selector requires `key`, `type`, and `value` properties

## Project Structure

```
.
├── app.js                # Express application setup
├── constants.js          # Application constants
├── index.js              # Entry point
├── routes.js             # API route definitions
├── swagger.js            # Swagger API documentation configuration
├── controllers/          # Request handlers
│   ├── app-shutdown.js   # Application shutdown handler
│   ├── error-handler.js  # Error handling middleware
│   ├── health.js         # Health check endpoint
│   ├── os-restart.js     # OS restart handler
│   ├── route-not-found-handler.js # 404 handler
│   └── scraper.js        # Main scraping controller
├── helpers/              # Utility functions
│   ├── filter-steps.js   # Process scraping steps
│   ├── puppeteer-health.js # Browser health checks
│   ├── setup-proxy-auth.js # Proxy configuration
│   └── validators.js     # Request validation schemas
└── tmp/                  # Temporary files & examples
    ├── browser-records/       # Browser recording examples
    ├── request-body-example/  # Example request bodies
    └── response-example/      # Example responses
```

## License

ISC License

## Author

Erdinç Cürebal