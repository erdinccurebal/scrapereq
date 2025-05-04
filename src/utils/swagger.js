/**
 * Swagger/OpenAPI Documentation Configuration
 *
 * Configures and initializes Swagger documentation for the API.
 * Scans JSDoc annotations in route and controller files to generate
 * interactive API documentation with proper security definitions.
 *
 * @module utils/swagger
 */

// Node core modules
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Third-party modules
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Application constants
import { SWAGGER_CONFIG } from '../constants.js';

// Get directory path in ESM context
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Swagger definition with OpenAPI 3.0 specification
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
      }
    },
    servers: SWAGGER_CONFIG.SERVERS.map((server) => ({
      url: server.URL,
      description: server.DESCRIPTION
    })),
    tags: SWAGGER_CONFIG.TAGS,
    components: {
      securitySchemes: {
        basicAuth: {
          type: SWAGGER_CONFIG.SECURITY_SCHEMES.BASIC_AUTH.TYPE,
          scheme: SWAGGER_CONFIG.SECURITY_SCHEMES.BASIC_AUTH.SCHEME,
          description: SWAGGER_CONFIG.SECURITY_SCHEMES.BASIC_AUTH.DESCRIPTION
        }
      }
    },
    security: [{ basicAuth: [] }] // Apply basic auth globally
  },
  // Scan these paths for JSDoc annotations
  apis: [join(__dirname, '../routes/**/*.js'), join(__dirname, '../controllers/**/*.js')]
};

// Generate OpenAPI specification from JSDoc comments
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Customize Swagger UI appearance and behavior
const swaggerUiOptions = {
  explorer: SWAGGER_CONFIG.OPTIONS.EXPLORER, // Enable API explorer
  customCss: SWAGGER_CONFIG.OPTIONS.CUSTOM_CSS, // Custom styling
  swaggerOptions: {
    docExpansion: 'list', // Expand/collapse tag groups
    filter: true, // Enable filtering operations
    displayRequestDuration: true // Show API request execution time
  }
};

/**
 * Sets up Swagger documentation endpoints
 *
 * Mounts the Swagger UI interface and JSON specification to the provided router,
 * making API documentation available for developers and consumers.
 *
 * @param {Object} router - Express router instance
 * @throws {Error} If router parameter is missing
 */
export function setupSwagger(router) {
  if (!router) {
    throw new Error('Express router instance is required');
  }

  const basePath = '/docs';

  // Serve Swagger UI at /docs
  router.use(basePath, swaggerUi.serve, swaggerUi.setup(swaggerDocs, swaggerUiOptions));

  // Serve raw OpenAPI specification as JSON at /docs.json
  // Useful for automated tools and code generators
  router.get(`${basePath}.json`, (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocs);
  });
}
