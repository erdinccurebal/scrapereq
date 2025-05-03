/**
 * Swagger Configuration
 * Sets up API documentation based on JSDoc annotations
 */

// Node core modules
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Node third-party modules
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Application constants
import { SWAGGER_CONFIG } from '../constants.js';

// Get current file and directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Swagger definition options
const swaggerOptions = {
  definition: {
    openapi: SWAGGER_CONFIG.OPENAPI_VERSION,
    info: {
      title: SWAGGER_CONFIG.INFO.TITLE,
      version: SWAGGER_CONFIG.INFO.VERSION,
      description: SWAGGER_CONFIG.INFO.DESCRIPTION,
      contact: {
        name: SWAGGER_CONFIG.INFO.CONTACT.NAME,
        email: SWAGGER_CONFIG.INFO.CONTACT.EMAIL,
        url: SWAGGER_CONFIG.INFO.CONTACT.URL
      },
      license: {
        name: SWAGGER_CONFIG.INFO.LICENSE.NAME,
        url: SWAGGER_CONFIG.INFO.LICENSE.URL
      },
    },
    servers: SWAGGER_CONFIG.SERVERS.map(server => ({
      url: server.URL,
      description: server.DESCRIPTION
    })),
    components: {
      securitySchemes: {
        basicAuth: {
          type: SWAGGER_CONFIG.SECURITY_SCHEMES.BASIC_AUTH.TYPE,
          scheme: SWAGGER_CONFIG.SECURITY_SCHEMES.BASIC_AUTH.SCHEME,
          description: SWAGGER_CONFIG.SECURITY_SCHEMES.BASIC_AUTH.DESCRIPTION
        },
      }
    },
    security: [{ basicAuth: [] }]
  },
  apis: [
    join(__dirname, '../routes/**/*.js'),
    join(__dirname, '../controllers/**/*.js')
  ],
};

// Initialize swagger-jsdoc
export const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Swagger UI setup options
export const swaggerUiOptions = {
  explorer: SWAGGER_CONFIG.OPTIONS.EXPLORER,
  customCss: SWAGGER_CONFIG.OPTIONS.CUSTOM_CSS,
  swaggerOptions: {
    docExpansion: 'list',
    filter: true,
    displayRequestDuration: true
  }
};

/**
 * Setup Swagger documentation for Express app
 * 
 * @param {Object} router - Express router instance
 * @param {String} path - URL path for swagger documentation (default: /api/docs)
 * @returns {void}
 */
export function setupSwagger(router, path = "/docs") {
  if (!router) {
    throw new Error('Express router instance is required');
  }
  
  // Serve swagger documentation at specified path
  router.use(path, swaggerUi.serve, swaggerUi.setup(swaggerDocs, swaggerUiOptions));
  
  // Serve swagger spec as JSON at /api/docs.json
  router.get(`${path}.json`, (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocs);
  });
  
  console.log(`Swagger documentation available at ${path}`);
  console.log(`Swagger spec available at ${path}.json`);
}
