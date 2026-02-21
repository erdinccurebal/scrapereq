# Security Policy

## Supported Versions

| Version | Supported |
| ------- | --------- |
| 1.0.x   | Yes       |
| < 1.0.0 | No        |

## Reporting a Vulnerability

We take security issues seriously. If you discover a security vulnerability in Scrapereq, please report it responsibly.

### How to Report

1. **Do NOT open a public issue.** Security vulnerabilities should not be discussed publicly until a fix is available.
2. Use [GitHub Security Advisories](https://github.com/erdinccurebal/scrapereq/security/advisories/new) to report the vulnerability privately.
3. Alternatively, contact the maintainer directly at **erdinc@curebal.dev**.

### What to Include

- A description of the vulnerability
- Steps to reproduce the issue
- The potential impact
- Any suggested fixes (if applicable)

### Response Timeline

- **Acknowledgement:** Within 48 hours of receiving the report
- **Initial Assessment:** Within 5 business days
- **Fix & Disclosure:** We aim to release a fix within 30 days for critical issues

### Scope

The following are in scope for security reports:

- Authentication bypass
- Injection vulnerabilities (command injection, XSS, etc.)
- Unauthorized data access
- Denial of service vulnerabilities
- Dependency vulnerabilities with known exploits

### Out of Scope

- Issues in third-party dependencies without a proof of concept specific to this project
- Social engineering attacks
- Issues requiring physical access to the server

## Security Best Practices

When deploying Scrapereq:

- Always change the default authentication credentials
- Use HTTPS in production
- Set `NODE_ENV=production` to enable strict security headers
- Keep dependencies up to date (Dependabot is enabled)
- Use environment variables for all sensitive configuration
- Restrict network access to the API where possible
