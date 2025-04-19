/**
 * Swagger Configuration
 * Sets up API documentation based on JSDoc annotations
 */

import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current file and directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Swagger definition options
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Req-Scrap',
      version: '1.0.0',
      description: 'Web scraping API using puppeteer',
      contact: {
        name: 'API Support',
      },
      license: {
        name: 'ISC',
      },
    },
    components: {
      securitySchemes: {
        basicAuth: {
          type: 'http',
          scheme: 'basic',
        },
      },
    },
    security: [{
      basicAuth: [],
    }],
  },
  // Path to API docs (look for JSDoc comments in these files)
  apis: [
    join(__dirname, './routes.js'),
    join(__dirname, './controllers/*.js'),
  ],
};

// Initialize swagger-jsdoc
const swaggerDocs = swaggerJsDoc(swaggerOptions);

export { swaggerDocs, swaggerUi };