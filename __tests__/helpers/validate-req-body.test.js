import { helperScrapeValidateRequestBody } from '../../src/helpers/scrape-validate-req-body.js';

const validBody = () => ({
  proxy: {
    bypassCode: 'test',
    auth: { enabled: false, username: 'u', password: 'p' },
    servers: []
  },
  record: {
    title: 'Test',
    steps: [{ type: 'navigate', url: 'https://example.com' }]
  },
  capture: {
    selectors: [{ key: 'title', type: 'CSS', value: 'h1' }]
  },
  output: {
    responseType: 'JSON',
    screenshots: { onError: false, onSuccess: false }
  }
});

describe('helperScrapeValidateRequestBody', () => {
  it('should return validated value for valid body', () => {
    const result = helperScrapeValidateRequestBody({ body: validBody() });
    expect(result).toBeDefined();
    expect(result.record.title).toBe('Test');
  });

  it('should throw with status 400 for invalid body', () => {
    try {
      helperScrapeValidateRequestBody({ body: {} });
      expect(true).toBe(false); // should not reach here
    } catch (error) {
      expect(error.status).toBe(400);
      expect(error.code).toBe('ERROR_REQUEST_BODY_VALIDATION');
    }
  });

  it('should throw for missing record', () => {
    const body = validBody();
    delete body.record;
    expect(() => helperScrapeValidateRequestBody({ body })).toThrow();
  });

  it('should throw for empty body', () => {
    expect(() => helperScrapeValidateRequestBody({ body: null })).toThrow();
  });
});
