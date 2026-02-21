# Contributing to Scrapereq

Thank you for your interest in contributing to Scrapereq! This guide will help you get started.

## Development Setup

1. Fork and clone the repository:

   ```bash
   git clone https://github.com/YOUR_USERNAME/scrapereq.git
   cd scrapereq
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy the environment template:

   ```bash
   cp .env.example .env
   ```

4. Start the development server:

   ```bash
   npm start
   ```

## Code Style

This project uses **ESLint** and **Prettier** for code formatting and linting.

```bash
# Check for linting issues
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Format code with Prettier
npm run format
```

Please ensure your code passes linting before submitting a PR.

## Running Tests

```bash
npm test
```

## How to Contribute

### Reporting Bugs

- Use the [Bug Report](https://github.com/erdinccurebal/scrapereq/issues/new?template=bug_report.md) issue template
- Include steps to reproduce, expected behavior, and actual behavior
- Include your Node.js version and operating system

### Suggesting Features

- Use the [Feature Request](https://github.com/erdinccurebal/scrapereq/issues/new?template=feature_request.md) issue template
- Describe the problem you're trying to solve
- Explain your proposed solution

### Submitting Pull Requests

1. Create a new branch from `master`:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and ensure:
   - Code passes linting (`npm run lint`)
   - Tests pass (`npm test`)
   - New features include tests where applicable

3. Write clear commit messages:

   ```
   feat: add proxy health check endpoint
   fix: resolve timeout issue in scraping steps
   docs: update API endpoint documentation
   ```

4. Push your branch and open a Pull Request against `master`.

## Commit Message Convention

We follow a simplified [Conventional Commits](https://www.conventionalcommits.org/) format:

- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation changes
- `refactor:` — Code refactoring
- `test:` — Adding or updating tests
- `chore:` — Maintenance tasks

## Project Structure

```
src/
  app.js              # Express app setup
  config.js           # Environment configuration
  constants.js        # Application constants
  controllers/        # Request handlers
  helpers/            # Business logic
  routes/             # Route definitions
  utils/              # Middleware utilities
```

## Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before participating.

## Questions?

Feel free to open an issue for any questions about contributing.
