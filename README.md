# 🕸️ Scrapereq

<div align="center">
  <h3>A powerful and flexible web scraping API built with Express.js and Puppeteer</h3>
  <p>
    <img src="https://img.shields.io/badge/Express-5.1.0-000000?style=flat-square&logo=express" alt="Express.js" />
    <img src="https://img.shields.io/badge/Puppeteer-24.7.2-40B5A4?style=flat-square&logo=puppeteer" alt="Puppeteer" />
    <img src="https://img.shields.io/badge/Node.js-v20+-339933?style=flat-square&logo=node.js" alt="Node.js" />
    <img src="https://img.shields.io/badge/License-ISC-blue?style=flat-square" alt="License" />
  </p>
  <p>
    <a href="#-api-endpoints">API Documentation</a> •
    <a href="#-installation">Installation</a> •
    <a href="#-features">Features</a> •
    <a href="#-tech-stack">Tech Stack</a>
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
- **🤖 Puppeteer v24.7.2**: Headless Chrome browser automation
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
   TMP_DIR=/path/to/persistent/directory # Optional: defaults to ./tmp

   # Browser Concurrency
   MAX_CONCURRENT_BROWSERS=2 # Number of concurrent browser instances

   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000 # 15 minutes in milliseconds
   RATE_LIMIT_MAX_REQUESTS=100 # Maximum requests per window
   ```

4. **Start the application**:
   ```bash
   npm start
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
      "type": "wait",
      "value": "1000"
    },
    {
      "type": "setViewport",
      "width": 1366,
      "height": 768
    }
  ]
}
```

</details>

### 📊 Performance Metrics

```http
GET /api/scrape/metrics
```

Returns performance metrics for all scraping operations.

```http
POST /api/scrape/metrics/reset
```

Resets all collected metrics.

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

## 🛠️ CLI Startup Options

The project includes several command-line utility scripts for easy startup and management:

```bash
# Start in development mode with auto-reload
npm run dev

# Start in production mode
npm run prod

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
npm run docker:start   # Start with Docker configuration
```

## 📁 Project Structure

```
.
├── index.js                # Entry point
├── start.js                # CLI startup script
├── src/                    # Application source code
│   ├── app.js              # Express app configuration
│   ├── config.js           # Configuration module
│   ├── constants.js        # Constants and enums
│   ├── controllers/        # Request handlers
│   ├── helpers/            # Helper functions
│   ├── routes/             # API route definitions
│   └── utils/              # Utility middleware
├── __tests__/              # Test files
└── tmp/                    # Temporary files directory
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🔄 Last Updated

May 4, 2025
