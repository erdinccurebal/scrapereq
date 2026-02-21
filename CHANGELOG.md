# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-05-06

### Added

- Step-based web scraping with Puppeteer (navigate, click, wait, setViewport, change, waitForElement)
- Multiple speed modes: TURBO, FAST, NORMAL, SLOW, SLOWEST, CRAWL, STEALTH
- Timeout modes: SHORT, NORMAL, LONG
- Proxy support with authentication and multi-server rotation (HTTP, HTTPS, SOCKS4, SOCKS5)
- Data extraction via CSS, XPath, and full page HTML selectors
- Multiple response types: JSON, RAW, NONE
- Screenshot capture on error and success with automatic hourly cleanup
- Browser concurrency control via semaphore-based limiting
- Basic authentication for API endpoints
- Security middleware: Helmet, CORS, rate limiting
- Request validation with Joi schemas
- Interactive Swagger API documentation at `/api/docs`
- Health check endpoint with system metrics
- Application shutdown and OS restart endpoints
- Docker support with multi-stage build and docker-compose
- CI/CD pipeline with GitHub Actions
- Automated dependency updates with Dependabot
