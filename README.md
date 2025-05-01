# 🕸️ Scrapereq

<div align="center">
  <h3>A powerful and flexible web scraping API built with Express.js and Puppeteer</h3>
  <p>
    <img src="https://img.shields.io/badge/Express-5.1.0-000000?style=flat-square&logo=express" alt="Express.js" />
    <img src="https://img.shields.io/badge/Puppeteer-24.7.0-40B5A4?style=flat-square&logo=puppeteer" alt="Puppeteer" />
    <img src="https://img.shields.io/badge/Node.js-v18+-339933?style=flat-square&logo=node.js" alt="Node.js" />
    <img src="https://img.shields.io/badge/License-ISC-blue?style=flat-square" alt="License" />
  </p>
  <p>
    <a href="https://scrapereq.trial.town/docs" target="_blank">API Documentation</a>
  </p>
</div>

## 📋 Overview

Scrapereq is a RESTful API service that allows you to perform web scraping operations by defining a series of steps executed by a headless browser. It provides a clean and secure way to extract data from websites with advanced features like proxy support, customizable scraping speeds, robust validation, and error handling.

## ✨ Features

### Core Capabilities
- **🔄 Step-Based Scraping**: Define your scraping workflow as a series of steps (navigate, click, wait, setViewport, etc.)
- **⚡ Speed Control**: Multiple speed modes (TURBO, FAST, NORMAL, SLOW, SLOWEST, CRAWL, STEALTH)
- **🔍 Selector Support**: Extract data using CSS, XPath, or full page HTML selectors
- **✅ Enhanced Validation**: Comprehensive request validation with clear error messages

### Security & Reliability
- **🔐 Built-in Security**: Basic authentication, helmet protection, and CORS configuration
- **🌐 Enhanced Proxy Support**: Advanced proxy configuration with authentication and multiple proxy rotation
- **🔄 Error Handling**: Comprehensive error reporting with step indexing
- **💪 Browser Resilience**: Automatic disconnection detection and resource management

### Advanced Features
- **📸 Screenshot Capabilities**: Capture success and error screenshots with configurable options
- **📊 API Monitoring**: Detailed health check endpoint with system information
- **📝 Swagger Documentation**: Interactive API documentation with detailed request/response examples
- **🔧 System Controls**: Application shutdown and OS restart endpoints
- **💾 Persistent Storage**: Configurable screenshot directory for persistent storage across deployments
- **🧹 Automatic Cleanup**: Automated cleanup of old screenshot files
- **📈 Performance Metrics**: Track and analyze scraping performance with detailed metrics
- **🔁 Retry Mechanism**: Intelligent retry functionality for handling transient errors
- **🛠️ CLI Utilities**: User-friendly command-line interface for development and deployment

## 🛠️ Tech Stack

- **📦 Node.js**: JavaScript runtime
- **🚀 Express.js v5.1.0**: Web application framework
- **🤖 Puppeteer v24.7.0**: Headless Chrome browser automation
- **🧩 Puppeteer-Extra v3.3.6**: Plugin system for Puppeteer
- **⏺️ @puppeteer/replay v3.1.1**: Record and replay browser interactions
- **✅ Joi v17.13.3**: Request validation
- **📝 Morgan**: HTTP request logging
- **🛡️ Helmet v8.1.0**: Security middleware
- **📚 Swagger-JSDoc v6.2.8**: API documentation generation
- **🌐 Swagger-UI-Express v5.0.1**: Interactive API documentation
- **🌐 CORS**: Cross-Origin Resource Sharing support
- **⚙️ dotenv v16.5.0**: Environment configuration
- **🧪 Jest & Supertest**: Testing framework

## 🚀 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/scrapereq.git
   cd scrapereq
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create a configuration file**:
   
   Create a `.env` file in the root directory based on the following template:
   ```env
   # Server Configuration
   PORT=3000
   HOST=localhost
   NODE_ENV=development
   WEB_ADDRESS=http://localhost:3000

   # Authentication
   AUTH_USERNAME=admin
   AUTH_PASSWORD=secretpassword

   # Puppeteer Configuration
   CHROME_PATH=/path/to/chrome # Optional custom Chrome path

   # File Storage
   TMP_DIR=/path/to/persistent/directory # For example: /var/www/scrapereq-data/tmp
   ```

4. **Start the application**:
   ```bash
   npm start
   ```

## 🔌 API Endpoints

### 🔍 Health Check
```http
GET /health
```
✅ Returns detailed system information and checks if all components are working correctly:
- Project metadata and versions
- Application status and uptime
- Puppeteer browser functionality test
- System information (OS, memory, CPU)

### 🕸️ Scraper
```http
POST /
```
Main endpoint for web scraping operations. Configure your scraping workflow with a detailed JSON structure.

#### Example Request:
<details>
<summary>📋 View example request body</summary>

```json
{
  "title": "Google Search Example",
  "speedMode": "NORMAL",
  "timeoutMode": "NORMAL",
  "responseType": "JSON",
  "errorScreenshot": true,
  "successScreenshot": true,
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
  "proxyAuth": {
    "enabled": true,
    "username": "user",
    "password": "pass"
  },
  "proxies": [
    {
      "server": "proxy1.example.com",
      "port": 8080,
      "protocol": "HTTP"
    },
    {
      "server": "proxy2.example.com",
      "port": 8081,
      "protocol": "HTTPS"
    }
  ]
}
```
</details>

#### Response Examples:

<details>
<summary>✅ Successful Response</summary>

```json
{
  "success": true,
  "data": {
    "catch": {
      "search_results": "<div>Result content...</div>",
      "page_title": "Example Search - Google Search"
    },
    "screenshotUrl": "http://localhost:3000/tmp/success-2025-04-21T14-32-48.png",
    "proxy": "--proxy-server=http://proxy1.example.com:8080"
  }
}
```
</details>

<details>
<summary>❌ Error Response</summary>

```json
{
  "success": false,
  "data": {
    "message": "Error at step 3: Selector not found",
    "stack": ["...error stack trace..."],
    "screenshotUrl": "http://localhost:3000/tmp/error-2025-04-21T14-35-18.png",
    "proxy": "--proxy-server=http://proxy1.example.com:8080"
  }
}
```
</details>

### 🔧 System Management

```http
POST /app-shutdown
```
Safely shuts down the application with a 3-second delay.

```http
POST /os-restart
```
Initiates an operating system restart (requires appropriate permissions).

### 📊 Performance Metrics

The application includes a performance metrics system that tracks and analyzes scraping operations:

#### Metrics API Endpoints

```http
GET /api/scrape/metrics
```
Returns basic performance metrics for all scraping operations.

```http
GET /api/scrape/metrics?detailed=true
```
Returns detailed metrics including breakdowns by proxy, URL pattern, and response type.

```http
POST /api/scrape/metrics/reset
```
Resets all collected metrics.

#### Metrics Provided

| Metric | Description |
|--------|-------------|
| `operations` | Total number of scraping operations |
| `successful` | Number of successful operations |
| `failed` | Number of failed operations |
| `successRate` | Percentage of successful operations |
| `averageDuration` | Average operation duration in milliseconds |
| `byProxy` | Breakdown of operations by proxy (detailed mode only) |
| `byUrl` | Breakdown of operations by domain (detailed mode only) |
| `byResponseType` | Breakdown by response type (detailed mode only) |
| `errors` | Most common error types (detailed mode only) |
| `recent` | Recent operations history (detailed mode only) |

#### Sample Metrics Response

```json
{
  "success": true,
  "data": {
    "operations": 120,
    "successful": 105,
    "failed": 15,
    "successRate": "87.50%",
    "averageDuration": "1255ms",
    "timestamp": "2025-05-01T12:30:45.123Z"
  }
}
```

## 🔐 Authentication

The API is secured with basic authentication:

| Username | Password | Configuration |
|----------|----------|---------------|
| `admin` | `admin` | Default values |

You can change these values in the `.env` file or in the `constants.js` file:

```env
# Authentication
AUTH_USERNAME=new_username
AUTH_PASSWORD=secure_password
```

## ⚙️ Configuration

The application can be configured through:
- **.env file**: For environment variables
- **constants.js**: For constant values

### Key Configuration Options

| Category | Description |
|----------|-------------|
| 🔄 **Speed Modes** | Controls scraping pace (TURBO, FAST, NORMAL, SLOW, SLOWEST, CRAWL, STEALTH) |
| ⏱️ **Timeout Values** | Timeout values for operations (SHORT, NORMAL, LONG) |
| 🌐 **Browser Settings** | Browser configurations (user agent, headless mode, etc.) |
| 🔐 **Proxy Settings** | Proxy server configurations |
| 🛡️ **API Security** | API security settings |
| 📸 **Screenshot Options** | Screenshot configurations |
| ✅ **Validation Rules** | Enhanced validation rules for requests |

### Screenshot Storage Configuration

By default, screenshots are stored in the `tmp` directory within the project root. For persistent storage across deployments, you can set a custom path using the `TMP_DIR` environment variable:

```env
TMP_DIR=/path/to/persistent/directory
```

For Ubuntu 24.04 deployments, consider using a path outside the application directory, such as `/var/www/scrapereq-data/tmp` to ensure screenshots are preserved when the application is redeployed.

The application automatically:
- Creates the directory if it doesn't exist
- Serves static files from this directory under the `/tmp` URL path
- Cleans up screenshots older than 24 hours on a regular schedule

## 📊 Response Types

The scraper supports multiple response formats:

| Type | Description |
|------|-------------|
| `JSON` | Returns structured JSON with success status, data, proxy information, and screenshot URLs |
| `RAW` | Returns raw content without formatting, directly from the first selector |
| `NONE` | No response content (useful for headless operations) |

### JSON Response Format Example

```json
{
  "success": true,
  "data": {
    "catch": {
      "search_results": "<div>Result content...</div>",
      "page_title": "Example Search - Google Search"
    },
    "screenshotUrl": "http://localhost:3000/tmp/success-2025-04-26T14-32-48.png",
    "proxy": {
      "ip": "248.25.15.15",
      "port": 3122
    }
  }
}
```

### RAW Response Format

When using `RAW` response type, only the first selector's content is returned directly without any wrapping JSON structure. This is useful for extracting specific HTML or text content that needs to be processed elsewhere.

**Note:** When using `RAW` response type, only one selector can be provided.

## 🔍 Selector Types and Validation Rules

Data can be extracted using different selector methods:

| Selector Type | Usage |
|---------------|-------|
| `CSS` | Standard CSS selectors |
| `XPATH` | XPath expressions |
| `FULL` | Retrieves the full page HTML content |

### Selector Validation Rules:

- When `responseType` is set to `NONE`, selectors cannot be provided
- When `responseType` is set to `RAW`, only one selector can be used
- Maximum one `FULL` type selector is allowed regardless of response type
- Each selector requires `key`, `type`, and `value` properties

## 🌐 Enhanced Proxy Support

The application supports advanced proxy configurations:

### Proxy Authentication

```json
"proxyAuth": {
  "enabled": true,
  "username": "user",
  "password": "pass"
}
```

### Multiple Proxy Rotation

```json
"proxies": [
  {
    "server": "proxy1.example.com",
    "port": 8080,
    "protocol": "HTTP"
  },
  {
    "server": "proxy2.example.com",
    "port": 8081,
    "protocol": "HTTPS"
  }
]
```

This feature allows for:
- Load balancing across multiple proxy servers
- Automatic failover if one proxy becomes unavailable
- Reduced chance of IP blocking during intensive scraping operations
- Support for different proxy protocols (HTTP, HTTPS, SOCKS4, SOCKS5)

## 🔁 Retry Mechanism

The application includes a sophisticated retry mechanism for handling transient errors during scraping operations:

### Features

- **🔄 Exponential Backoff**: Automatically increases wait time between retry attempts
- **🎲 Jitter**: Adds randomness to retry intervals to prevent thundering herd problems
- **🔍 Error Detection**: Intelligent categorization of errors to determine if retry is appropriate
- **📈 Configurable Retries**: Adjustable maximum retry attempts, initial delay, and maximum delay

### Error Categories Handled

| Error Type | Description | Default Behavior |
|------------|-------------|------------------|
| Network Errors | Connectivity issues, timeouts | Retry with backoff |
| Browser Disconnection | Browser crashes or disconnects | Restart browser and retry |
| Captcha Detection | Detection of captcha challenges | Rotate proxy and retry |
| Selector Not Found | Element not found on page | Depends on configuration |

### Implementation

The retry functionality is implemented in the `retry-operations.js` helper, which provides a generic retry wrapper for any async function:

```javascript
await helperRetryOperation(async () => {
  // Your scraping operation here
}, {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  shouldRetry: (error) => helperErrorDetectors.isNetworkError(error)
})
```

## 🛠️ CLI Startup Utility

The project includes a command-line interface (CLI) tool for easy startup and management:

### Available Commands

```bash
# Start in development mode with auto-reload (default)
npm start
# or
npm run dev

# Start in production mode
npm run prod

# Run tests
npm test

# Build and run with Docker
npm run docker:start
```

### Features

- **🔍 Environment Setup**: Automatically checks for and creates necessary files and directories
- **🖥️ Development Mode**: Starts the application with file watching for auto-reload
- **🏭 Production Mode**: Optimized for production environments
- **🧪 Test Runner**: Simplified test execution
- **🐳 Docker Integration**: Simplifies Docker build and run processes
- **🎨 Colorized Output**: User-friendly terminal output with colors and icons

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- For Docker deployment: Docker and Docker Compose

### Quick Start

1. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/yourusername/scrapereq.git
   cd scrapereq
   npm install
   ```

2. Create your environment configuration:
   ```bash
   # Copy the example config
   cp .env.example .env
   
   # Edit with your settings
   notepad .env  # On Windows
   ```

3. Start the application in development mode:
   ```bash
   npm start
   ```

4. Visit the API documentation to explore the endpoints:
   ```
   http://localhost:3000/docs
   ```

### Docker Deployment

For containerized deployment:

```bash
# Start with Docker Compose
docker-compose up -d

# Or use the CLI utility
npm run docker:start
```

### Example: Simple Scraping Request

Here's a minimal example to get started with scraping:

```bash
curl -X POST http://localhost:3000/api/scrape/start \
  -u admin:admin \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Simple Example",
    "responseType": "JSON",
    "speedMode": "NORMAL",
    "errorScreenshot": true,
    "selectors": [
      {
        "key": "title",
        "type": "CSS",
        "value": "title"
      }
    ],
    "steps": [
      {
        "type": "navigate",
        "url": "https://example.com"
      }
    ]
  }'
```

## 🤝 Contributing

Contributions are welcome! Here's how you can contribute:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation when necessary
- Keep dependencies up to date

## 📚 Additional Resources

- [Puppeteer Documentation](https://pptr.dev/)
- [Express.js Documentation](https://expressjs.com/)
- [Joi Validation Documentation](https://joi.dev/api/)
- [Docker Documentation](https://docs.docker.com/)

## 📁 Project Structure

```
.
├── index.js                # Entry point
├── start.js                # CLI startup script with development utilities
├── app.js                  # Express application setup
├── config.js               # Centralized configuration
├── constants.js            # Application constants
├── Dockerfile              # Docker image definition
├── docker-compose.yml      # Docker Compose configuration
├── .env.example            # Example environment variables
├── package.json            # Project dependencies and scripts
├── jest.config.js          # Jest test configuration
│
├── src/                    # Application source code
│   ├── app.js              # Express app configuration
│   ├── config.js           # Configuration module
│   ├── constants.js        # Constants and enums
│   │
│   ├── controllers/        # Request handlers
│   │   ├── error-handler.js        # Error handling middleware
│   │   ├── route-not-found-handler.js  # 404 handler
│   │   ├── api/
│   │   │   ├── app/               # Application control endpoints
│   │   │   │   ├── health.js      # Health check endpoint
│   │   │   │   └── shutdown.js    # Application shutdown handler
│   │   │   ├── os/
│   │   │   │   └── restart.js     # OS restart handler
│   │   │   └── scrape/
│   │   │       ├── metrics.js     # Scraping metrics endpoints
│   │   │       ├── start.js       # Main scraping controller
│   │   │       └── test.js        # Test scraping endpoint
│   │
│   ├── helpers/           # Helper functions
│   │   ├── browser-semaphore.js   # Limit concurrent browser instances
│   │   ├── cleanup-screenshots.js # Automatically clean up old screenshots
│   │   ├── filter-steps.js        # Process scraping steps
│   │   ├── format-uptime.js       # Format system uptime
│   │   ├── proxies-random-get-one.js # Random proxy selection
│   │   ├── retry-operations.js    # Retry mechanism for error handling
│   │   ├── scraping-metrics.js    # Performance monitoring for scraping operations
│   │   └── validators.js          # Request validation schemas
│   │
│   ├── routes/            # API route definitions
│   │   ├── api/
│   │   │   ├── app.js     # Application control routes
│   │   │   ├── os.js      # OS operation routes
│   │   │   └── scrape.js  # Scraping routes
│   │
│   └── utils/             # Utility middleware
│       ├── cors.js        # CORS configuration
│       ├── helmet.js      # Security headers
│       ├── json-parser.js # JSON body parser
│       ├── logger.js      # HTTP request logging
│       ├── rate-limiter.js # Rate limiting
│       └── swagger.js     # API documentation
│
├── __tests__/             # Test files
│   ├── api/
│   │   └── endpoints.test.js  # API endpoint tests
│   └── helpers/
│       └── helpers.test.js    # Helper function tests
│
└── tmp/                  # Temporary files directory
    ├── browser-records/  # Browser recording samples
    ├── request-body-example/ # Request body examples
    ├── response-example/ # Response examples
    └── *.png             # Screenshot files (not tracked in git)
```

## ⚡ Performance Considerations

- **🔒 Resource Management**: Browser instances are limited using a semaphore to prevent resource exhaustion
- **⏱️ Speed Optimization**: Adjustable speed modes optimize between performance and detection risk
- **⏲️ Customized Timeouts**: Customized timeout values for different operation types
- **🔍 Quick Debugging**: Error tracking with step indexing
- **🛡️ Browser Resilience**: Enhanced browser management with disconnection detection

## 🛡️ Browser Resilience

- **🔄 Disconnection Detection**: Automatic detection for manually closed browsers
- **🔓 Resource Management**: Semaphore is released when browser disconnects
- **📸 Guaranteed Screenshots**: Screenshots are captured even during unexpected errors
- **⏱️ Pre-Closure Management**: Timeout operations before browser closure

## 🚀 Deployment Considerations

When deploying this application, consider the following:

1. **💾 Persistent Storage**: Configure the `TMP_DIR` environment variable to point to a persistent directory that won't be deleted during redeployments.
   
2. **📂 File Permissions**: Ensure the application has read/write permissions for the configured `TMP_DIR`.
   
3. **🧹 Screenshot Cleanup**: The application automatically cleans up screenshots older than 24 hours. Adjust the cleanup schedule in `index.js` if necessary.

4. **🌐 Static File Serving**: The application serves files in `TMP_DIR` under the `/tmp` path. No additional configuration is required for static file serving.

## 📄 License

ISC License

## 👨‍💻 Author

Erdinç Cürebal

## 🔄 Last Updated

April 27, 2025