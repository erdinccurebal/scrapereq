# 🕸️ Scrapereq

<div align="center">
  <h3>A powerful and flexible web scraping API built with Express.js and Puppeteer</h3>
  <p>
    <img src="https://img.shields.io/badge/Express-5.1.0-000000?style=flat-square&logo=express" alt="Express.js" />
    <img src="https://img.shields.io/badge/Puppeteer-24.8.0-40B5A4?style=flat-square&logo=puppeteer" alt="Puppeteer" />
    <img src="https://img.shields.io/badge/Node.js-v20+-339933?style=flat-square&logo=node.js" alt="Node.js" />
    <img src="https://img.shields.io/badge/License-ISC-blue?style=flat-square" alt="License" />
    <img src="https://img.shields.io/github/actions/workflow/status/erdinccurebal/scrapereq/ci.yml?branch=master&style=flat-square&label=CI" alt="CI" />
  </p>
  <p>
    <a href="#-api-endpoints">API Documentation</a> •
    <a href="#-installation">Installation</a> •
    <a href="#-features">Features</a> •
    <a href="#-contributing">Contributing</a>
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
- **🛡️ Error Handling**: Consistent JSON error responses with contextual details and optional stack traces for debugging
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
- **🤖 Puppeteer v24.8.0**: Headless Chrome browser automation
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
   git clone https://github.com/erdinccurebal/scrapereq.git
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
   TMP_DIR=/path/to/persistent/directory # Optional: defaults to ./tmp

   # Browser Concurrency
   MAX_CONCURRENT_BROWSERS=2 # Number of concurrent browser instances

   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000 # 15 minutes in milliseconds
   RATE_LIMIT_MAX_REQUESTS=100 # Maximum requests per window

   # Proxy Configuration (Optional)
   SCRAPE_PROXY_BYPASS_CODE=your_secure_password # Password to bypass proxy requirement
   ```

4. **Start the application**:
   ```bash
   npm start
   ```

## 🐳 Docker Deployment

You can easily run the application using Docker:

```bash
# Build the Docker image
npm run docker:build

# Run the container
npm run docker:run
```

Or use the provided docker-compose.yml:

```bash
docker-compose up -d
```

## 🔌 API Endpoints

The API provides the following main endpoints:

### 🔍 Health Check

```http
GET /api/app/health
```

Returns detailed system information and checks if all components are working correctly.

### 🕸️ Scraper

```http
POST /api/scrape/start
```

Main endpoint for web scraping operations. Configure your scraping workflow with a detailed JSON structure.

#### Example Request:

<details>
<summary>📋 View example request body</summary>

```json
{
  "proxy": {
    "bypassCode": "your_secure_password",
    "auth": {
      "enabled": true,
      "username": "proxyuser",
      "password": "proxypass"
    },
    "servers": [
      {
        "server": "proxy1.example.com",
        "port": 8080
      },
      {
        "server": "proxy2.example.com",
        "port": 8081
      }
    ]
  },
  "record": {
    "title": "Google Search Example",
    "speedMode": "NORMAL",
    "timeoutMode": "NORMAL",
    "steps": [
      {
        "type": "navigate",
        "url": "https://www.google.com"
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
        "type": "click",
        "selectors": [["#L2AGLb"]]
      },
      {
        "type": "change",
        "selectors": [["input[name='q']"]],
        "value": "web scraping api"
      },
      {
        "type": "click",
        "selectors": [["input[name='btnK']"]]
      },
      {
        "type": "waitForElement",
        "selectors": [["#search"]]
      }
    ]
  },
  "capture": {
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
    ]
  },
  "headers": {
    "Accept-Language": "en-US,en;q=0.9",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36"
  },
  "output": {
    "screenshots": {
      "onError": true,
      "onSuccess": true
    },
    "responseType": "JSON"
  }
}
```

</details>

### 🧪 Test Endpoint

```http
POST /api/scrape/test
```

Runs a predefined scraping test using a fixed configuration. This endpoint is useful for:

- Testing if the scraping service is working correctly
- Checking proxy connectivity
- Validating browser functionality

The test endpoint uses a predefined configuration from `constants.js` with a sample scrape request that checks your IP address using a proxied connection.

### 🔧 System Management

```http
POST /api/app/shutdown
```

Safely shuts down the application.

```http
POST /api/os/restart
```

Initiates an operating system restart (requires appropriate permissions).

## 📚 Documentation

For complete API documentation, visit the Swagger UI endpoint after starting the application:

```
http://localhost:3000/api/docs
```

## 🔍 Selector Types

Data can be extracted using different selector methods:

| Selector Type | Usage                                |
| ------------- | ------------------------------------ |
| `CSS`         | Standard CSS selectors               |
| `XPATH`       | XPath expressions                    |
| `FULL`        | Retrieves the full page HTML content |

## 🔄 Response Types

The scraper supports multiple response formats:

| Type   | Description                                          |
| ------ | ---------------------------------------------------- |
| `JSON` | Returns structured JSON with data and metadata       |
| `RAW`  | Returns raw content from the first selector          |
| `NONE` | No response content (useful for headless operations) |

## ⚠️ Error Handling

The API implements a consistent error handling pattern:

- **Standardized Format**: All errors return a consistent JSON structure
- **Contextual Information**: Includes error code, message, and related data
- **Debug Support**: Stack traces included in development mode
- **Visual Evidence**: Error screenshots for visual debugging
- **Step Identification**: Clear indication of which step in the process failed
- **Proxy Errors**: Detailed information about proxy-related issues

Example error response:

```json
{
  "success": false,
  "data": {
    "message": "Failed to execute click operation on element",
    "code": "ERROR_ELEMENT_NOT_FOUND",
    "stepIndex": 3,
    "screenshotUrl": "/tmp/error-screenshot-123456.png"
  }
}
```

## 🛠️ CLI Startup Options

The project includes several command-line utility scripts:

```bash
# Start the application
npm start

# Run tests
npm test

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format

# Docker operations
npm run docker:build   # Build Docker image
npm run docker:run     # Run Docker container
```

## 📁 Project Structure

```
.
├── index.js                # Entry point
├── docker-compose.yml      # Docker Compose configuration
├── Dockerfile              # Docker configuration
├── src/                    # Application source code
│   ├── app.js              # Express app configuration
│   ├── config.js           # Configuration module
│   ├── constants.js        # Constants and enums
│   ├── controllers/        # Request handlers
│   │   ├── error-handler.js # Global error handling middleware
│   │   └── api/            # API controllers
│   ├── helpers/            # Helper functions
│   │   ├── browser-semaphore.js   # Browser instance management
│   │   ├── cleanup-screenshots.js # Screenshot cleanup utility
│   │   ├── do-scraping.js         # Main scraping logic
│   │   ├── proxies-random-get-one.js # Proxy rotation utility
│   │   ├── scrape-validate-req-body.js # Request validation
│   │   └── validators.js          # Schema validation definitions
│   ├── routes/             # API route definitions
│   └── utils/              # Utility middleware
├── __tests__/              # Test files
└── tmp/                    # Temporary files directory
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) before submitting a Pull Request.

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## 🔒 Security

For security vulnerabilities, please see our [Security Policy](SECURITY.md). Do **not** open a public issue for security concerns.

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.
