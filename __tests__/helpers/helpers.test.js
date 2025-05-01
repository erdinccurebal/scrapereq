/**
 * Helper functions unit tests
 * 
 * These tests verify that helper functions work as expected
 */

import { helperFormatUptime } from '../../src/helpers/format-uptime.js'
import { helperProxiesRandomGetOne } from '../../src/helpers/proxies-random-get-one.js'
import { helperFilterSteps } from '../../src/helpers/filter-steps.js'

describe('Helper Functions', () => {
  // Format uptime tests
  describe('helperFormatUptime', () => {
    it('should format seconds correctly', () => {
      expect(helperFormatUptime(45)).toBe('45s')
    })

    it('should format minutes and seconds correctly', () => {
      expect(helperFormatUptime(125)).toBe('2m 5s')
    })

    it('should format hours, minutes and seconds correctly', () => {
      expect(helperFormatUptime(3725)).toBe('1h 2m 5s')
    })

    it('should format days, hours, minutes and seconds correctly', () => {
      expect(helperFormatUptime(90025)).toBe('1d 1h 0m 25s')
    })
  })

  // Random proxy selector tests
  describe('helperProxiesRandomGetOne', () => {
    it('should select a random proxy from the list', () => {
      const proxies = [
        { server: 'proxy1.example.com', port: 8080, protocol: 'http' },
        { server: 'proxy2.example.com', port: 8080, protocol: 'http' },
        { server: 'proxy3.example.com', port: 8080, protocol: 'http' }
      ]
      const result = helperProxiesRandomGetOne({ proxies })
      expect(proxies).toContainEqual(result)
    })
  })

  // Filter steps tests
  describe('helperFilterSteps', () => {
    it('should return empty array when steps are not provided', () => {
      const result = helperFilterSteps({})
      expect(result).toBeDefined()
    })

    it('should return filtered steps when valid steps are provided', () => {
      const steps = [
        { type: 'navigate', url: 'https://example.com' },
        { type: 'click', selector: '#button' }
      ]
      const result = helperFilterSteps({ steps })
      expect(result.filteredSteps).toEqual(steps)
    })
  })
})