/**
 * API endpoint tests
 * 
 * These tests verify that API endpoints return the expected responses
 */

import request from 'supertest'
import { expressApp } from '../../src/app.js'

describe('API Endpoints', () => {
  // Root endpoint tests
  describe('GET /', () => {
    it('should return welcome message', async () => {
      const response = await request(expressApp).get('/')
      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.message).toBeDefined()
    })
  })

  // API root endpoint tests
  describe('GET /api', () => {
    it('should return API information', async () => {
      const response = await request(expressApp).get('/api')
      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.endpoints).toBeDefined()
    })
  })

  // 404 error handling
  describe('Non-existent endpoints', () => {
    it('should return 404 for non-existent route', async () => {
      const response = await request(expressApp).get('/non-existent-path')
      expect(response.status).toBe(404)
      expect(response.body.success).toBe(false)
      expect(response.body.data.code).toBe('ERROR_ROUTE_NOT_FOUND')
    })
  })
})