/**
 * API endpoint tests
 *
 * These tests verify that API endpoints return the expected responses
 */

import request from 'supertest';
import { expressApp } from '../../src/app.js';
import { config } from '../../src/config.js';

// Basic auth credentials for protected endpoints
const auth = {
  user: config.auth.username,
  pass: config.auth.password
};

describe('API Endpoints', () => {
  // Root endpoint tests
  describe('GET /', () => {
    it('should return welcome message', async () => {
      const response = await request(expressApp).get('/');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBeDefined();
    });
  });

  // API root endpoint tests
  describe('GET /api', () => {
    it('should return API information', async () => {
      const response = await request(expressApp).get('/api');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.endpoints).toBeDefined();
    });
  });

  // 404 error handling
  describe('Non-existent endpoints', () => {
    it('should return 404 for non-existent route', async () => {
      const response = await request(expressApp).get('/non-existent-path');
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.data.code).toBe('ERROR_ROUTE_NOT_FOUND');
    });
  });

  // Authentication tests
  describe('Authentication', () => {
    it('should return 401 for protected endpoint without auth', async () => {
      const response = await request(expressApp).get('/api/app/health');
      expect(response.status).toBe(401);
    });

    it('should return 401 for wrong credentials', async () => {
      const response = await request(expressApp)
        .get('/api/app/health')
        .auth('wrong', 'credentials');
      expect(response.status).toBe(401);
    });

    it('should return 200 for protected endpoint with valid auth', async () => {
      const response = await request(expressApp)
        .get('/api/app/health')
        .auth(auth.user, auth.pass);
      expect(response.status).toBe(200);
    });
  });

  // Health check endpoint
  describe('GET /api/app/health', () => {
    it('should return health information', async () => {
      const response = await request(expressApp)
        .get('/api/app/health')
        .auth(auth.user, auth.pass);
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });
  });

  // Scrape validation tests
  describe('POST /api/scrape/start', () => {
    it('should return 401 without auth', async () => {
      const response = await request(expressApp).post('/api/scrape/start').send({});
      expect(response.status).toBe(401);
    });

    it('should return 400 for empty body', async () => {
      const response = await request(expressApp)
        .post('/api/scrape/start')
        .auth(auth.user, auth.pass)
        .send({});
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.data.code).toBe('ERROR_REQUEST_BODY_VALIDATION');
    });

    it('should return 400 for missing record field', async () => {
      const response = await request(expressApp)
        .post('/api/scrape/start')
        .auth(auth.user, auth.pass)
        .send({
          proxy: { auth: { enabled: false, username: 'u', password: 'p' }, servers: [] }
        });
      expect(response.status).toBe(400);
      expect(response.body.data.code).toBe('ERROR_REQUEST_BODY_VALIDATION');
    });

    it('should return 400 for RAW responseType with no selectors', async () => {
      const response = await request(expressApp)
        .post('/api/scrape/start')
        .auth(auth.user, auth.pass)
        .send({
          proxy: { auth: { enabled: false, username: 'u', password: 'p' }, servers: [] },
          record: {
            title: 'Test',
            steps: [{ type: 'navigate', url: 'https://example.com' }]
          },
          capture: { selectors: [] },
          output: { responseType: 'RAW', screenshots: { onError: false, onSuccess: false } }
        });
      expect(response.status).toBe(400);
    });

    it('should return 400 for JSON responseType with no selectors', async () => {
      const response = await request(expressApp)
        .post('/api/scrape/start')
        .auth(auth.user, auth.pass)
        .send({
          proxy: { auth: { enabled: false, username: 'u', password: 'p' }, servers: [] },
          record: {
            title: 'Test',
            steps: [{ type: 'navigate', url: 'https://example.com' }]
          },
          capture: { selectors: [] },
          output: { responseType: 'JSON', screenshots: { onError: false, onSuccess: false } }
        });
      expect(response.status).toBe(400);
    });
  });

  // Swagger docs
  describe('GET /api/docs', () => {
    it('should return swagger UI', async () => {
      const response = await request(expressApp).get('/api/docs/');
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('text/html');
    });
  });
});
