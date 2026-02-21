## Project Overview

Scrapereq is a web scraping API built with Express.js 5 and Puppeteer. It uses ES Modules (`"type": "module"` in package.json).

## Code Conventions

- Use named exports (`export function`, `export const`)
- Follow existing naming: controllers use `controllerApiXxx`, helpers use `helperXxx`
- Use Joi for request validation
- Use `config.js` for environment variables, `constants.js` for static values
- Single quotes, semicolons required (enforced by ESLint + Prettier)
- Prefer `const` over `let`, never use `var`

## Architecture

- `src/routes/` — Express route definitions
- `src/controllers/` — Request handlers (thin, delegate to helpers)
- `src/helpers/` — Business logic
- `src/utils/` — Middleware (auth, cors, helmet, rate-limiter)
- `src/config.js` — Environment configuration
- `src/constants.js` — Application constants and enums

## Testing

- Jest with ES Module support (`node --experimental-vm-modules`)
- Tests in `__tests__/` directory
- Use supertest for HTTP endpoint tests
