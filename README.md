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

## 📝 Enhanced API Documentation

The application includes a comprehensive API documentation system:

### Interactive Swagger UI

Access the interactive API documentation at:
```
http://your-server:port/docs
```

The Swagger UI provides:
- Interactive API testing capabilities
- Detailed request and response schemas
- Example requests and responses
- Authentication integration
- Parameter descriptions and validation rules

### Validation Improvements

Recent updates include enhanced request validation:

- **Consistent Enum Values**: All enum values have been standardized across the codebase
- **Clear Error Messages**: Validation errors now provide specific guidance on what's wrong
- **Conditional Validation**: Complex validation rules based on other field values
- **Custom Validators**: Special validation logic for complex requirements

Example validation error response:
```json
{
  "success": false,
  "data": {
    "message": "ValidationError: Selectors cannot be provided when responseType is NONE"
  }
}
```

### Step Validation Features

- **URL Validation**: Ensures all navigation URLs are properly formatted
- **Required Step Checks**: Verifies that at least one navigate step with a valid URL is present
- **Type Checking**: Makes sure all parameters match their expected types

## ⚠️ Error Handling

The application provides detailed error information including:

| Error Detail | Description |
|--------------|-------------|
| 📍 **Step Index** | Index of the step where the error occurred (1-based indexing) |
| 🔄 **Step Type** | Type of step where the error occurred |
| 🔢 **Error Code** | Standardized error code (e.g., ERROR_UNKNOWN, ERROR_VALIDATION) |
| 📋 **Error Stack** | Full error stack for debugging |
| 🔢 **HTTP Status** | HTTP status codes with appropriate error messages |
| 📸 **Error Screenshots** | Screenshots of the page state at the time of error (if enabled) |
| 🌐 **Proxy Details** | Details about the proxy used during the failed request (if applicable) |

## 🔍 Enhanced Features

### Browser Semaphore

To prevent resource exhaustion, the application uses a semaphore to limit the number of concurrent browser instances:

- Automatically queues scraping requests when limits are reached
- Ensures browser resources are properly released after each operation
- Manages browser lifecycle even during unexpected errors

### Improved Screenshot Management

Enhanced screenshot capabilities:
- Option to take screenshots on success or error conditions
- Automatic filename generation with timestamps
- Configurable screenshot directory
- Automatic cleanup of old screenshots
- Direct URL access to screenshots via the application

## ⚠️ Error Handling

The application provides detailed error information including:

| Error Detail | Description |
|--------------|-------------|
| 📍 **Step Index** | Index of the step where the error occurred (1-based indexing) |
| 🔄 **Step Type** | Type of step where the error occurred |
| 🔢 **Error Code** | Standardized error code (e.g., ERROR_UNKNOWN, ERROR_VALIDATION) |
| 📋 **Error Stack** | Full error stack for debugging |
| 🔢 **HTTP Status** | HTTP status codes with appropriate error messages |
| 📸 **Error Screenshots** | Screenshots of the page state at the time of error (if enabled) |
| 🌐 **Proxy Details** | Details about the proxy used during the failed request (if applicable) |

## 📁 Project Structure

```
.
├── app.js                # Express application setup
├── constants.js          # Application constants
├── index.js              # Entry point
├── routes.js             # API route definitions
├── swagger.js            # Swagger API documentation configuration
│
├── controllers/          # Request handlers
│   ├── app-shutdown.js   # Application shutdown handler
│   ├── error-handler.js  # Error handling middleware
│   ├── health.js         # Health check endpoint
│   ├── os-restart.js     # OS restart handler
│   └── scraper.js        # Main scraping controller
│
├── helpers/              # Helper functions
│   ├── browser-semaphore.js # Limit concurrent browser instances
│   ├── cleanup-screenshots.js # Automatically clean up old screenshots
│   ├── filter-steps.js   # Process scraping steps
│   ├── puppeteer-health.js # Browser health checks
│   ├── setup-proxies.js  # Enhanced proxy configuration and rotation
│   └── validators.js     # Request validation schemas
│
└── tmp/                  # Default temporary files directory
    ├── browser-records/  # Browser recording samples
    ├── request-body-example/ # Request body examples
    ├── response-example/ # Response examples
    └── *.png             # Screenshot files
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