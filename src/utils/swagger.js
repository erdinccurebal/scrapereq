/**
 * Swagger Configuration
 * Sets up API documentation based on JSDoc annotations
 */

// Node core modules
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Node third-party modules
import swaggerJsDoc from 'swagger-jsdoc';

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
      },
      license: {
        name: SWAGGER_CONFIG.INFO.LICENSE.NAME,
      },
    },
    servers: [
      {
        url: SWAGGER_CONFIG.SERVERS.URL,
        description: SWAGGER_CONFIG.SERVERS.DESCRIPTION,
      },
    ],
    components: {
      securitySchemes: {
        basicAuth: {
          type: SWAGGER_CONFIG.SECURITY_SCHEMES.BASIC_AUTH.TYPE,
          scheme: SWAGGER_CONFIG.SECURITY_SCHEMES.BASIC_AUTH.SCHEME,
        },
      },
    },
    security: [{
      basicAuth: [],
    }],
  },
  apis: [
    join(__dirname, '../routes/**/*.js'),
  ],
};

// Initialize swagger-jsdoc
export const swaggerDocs = swaggerJsDoc(swaggerOptions);
