/**
 * Helmet Security Configuration Utility
 * 
 * This file provides Helmet security middleware configuration for the application.
 * Helmet helps secure Express apps by setting various HTTP headers to protect against common web vulnerabilities.
 */

// Node third-party modules
import helmet from 'helmet';

/**
 * Configure and return the Helmet middleware with application-specific security settings
 * @returns {Function} Configured Helmet middleware
 */
export function setupHelmet() {
    // Return basic helmet configuration
    // You can customize Helmet options here as needed
    return helmet();

    /* 
    // Example of customized configuration:
    return helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", "data:"]
            }
        },
        hsts: {
            maxAge: 31536000, // 1 year in seconds
            includeSubDomains: true,
            preload: true
        },
        frameguard: {
            action: 'deny'
        }
    });
    */
};