# Req Scrap

A Puppeteer-based API service for web scraping.

## Features

- Secure API service using Express and Express Basic Auth
- Web scraping with Puppeteer
- Easy definition of complex scraping steps using Replay package
- CORS support and enhanced security measures with Helmet
- Comprehensive health check features

## Installation

```bash
# Install dependencies
npm install

# Start the application
npm start
```

## Environment Variables

You can define the following variables in a `.env` file:

```
AUTH_USERNAME=your_username
AUTH_PASSWORD=your_password
PORT=3000
```

## API Usage

### Health Check

```
GET /health
```

Returns basic health status information.

#### Advanced Health Check:

```
GET /health?detailed=true
```

This endpoint returns detailed system information including:
- Service name and version
- Uptime
- Operating system and Node.js version
- CPU and memory usage information
- System load average

#### Puppeteer Health Check:

```
GET /health?detailed=true&check-puppeteer=true
```

In addition to the information above, this endpoint checks Puppeteer's operational status:
- Puppeteer version
- Puppeteer's launch capability
- Test page accessibility
- Any error messages if present

### Web Scraping API

```
POST /
```

Accepts requests in JSON format to extract data from websites:

```json
{
  "title": "Example Scrape",
  "proxy": {
    "server": "proxy.example.com:8080",
    "username": "proxyuser",
    "password": "proxypass"
  },
  "steps": [
    {
      "type": "navigate",
      "url": "https://example.com"
    },
    {
      "type": "click",
      "target": ".button-class"
    }
  ]
}
```

## Security

- Protected API endpoints with Express Basic Auth
- Security measures for HTTP headers with Helmet package
- Removal of X-Powered-By header

## License

ISC