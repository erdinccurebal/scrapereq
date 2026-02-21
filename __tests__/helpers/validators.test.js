import { helperValidatorsApiScrape } from '../../src/helpers/validators.js';

// Minimal valid request body for reuse in tests
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
    screenshots: { onError: false, onSuccess: false },
    responseType: 'JSON'
  }
});

describe('Validators - helperValidatorsApiScrape', () => {
  describe('valid requests', () => {
    it('should accept a minimal valid request', () => {
      const { error } = helperValidatorsApiScrape.validate(validBody());
      expect(error).toBeUndefined();
    });

    it('should apply default values when optional fields are omitted', () => {
      const body = {
        proxy: {
          auth: { enabled: false, username: 'u', password: 'p' },
          servers: []
        },
        record: {
          title: 'Test',
          steps: [{ type: 'navigate', url: 'https://example.com' }]
        }
      };
      const { error, value } = helperValidatorsApiScrape.validate(body);
      expect(error).toBeUndefined();
      expect(value.output.responseType).toBe('NONE');
      expect(value.output.screenshots.onError).toBe(true);
      expect(value.record.speedMode).toBe('NORMAL');
      expect(value.record.timeoutMode).toBe('NORMAL');
      expect(value.headers['Accept-Language']).toBeDefined();
    });
  });

  describe('proxy validation', () => {
    it('should reject missing proxy field', () => {
      const body = validBody();
      delete body.proxy;
      const { error } = helperValidatorsApiScrape.validate(body);
      expect(error).toBeDefined();
    });

    it('should reject invalid port (out of range)', () => {
      const body = validBody();
      body.proxy.servers = [{ server: 'proxy.test.com', port: 99999 }];
      const { error } = helperValidatorsApiScrape.validate(body);
      expect(error).toBeDefined();
    });

    it('should reject port 0', () => {
      const body = validBody();
      body.proxy.servers = [{ server: 'proxy.test.com', port: 0 }];
      const { error } = helperValidatorsApiScrape.validate(body);
      expect(error).toBeDefined();
    });

    it('should reject non-integer port', () => {
      const body = validBody();
      body.proxy.servers = [{ server: 'proxy.test.com', port: 80.5 }];
      const { error } = helperValidatorsApiScrape.validate(body);
      expect(error).toBeDefined();
    });

    it('should accept valid proxy with protocol', () => {
      const body = validBody();
      body.proxy.servers = [{ server: 'proxy.test.com', port: 8080, protocol: 'socks5' }];
      const { error } = helperValidatorsApiScrape.validate(body);
      expect(error).toBeUndefined();
    });

    it('should reject invalid proxy protocol', () => {
      const body = validBody();
      body.proxy.servers = [{ server: 'proxy.test.com', port: 8080, protocol: 'FTP' }];
      const { error } = helperValidatorsApiScrape.validate(body);
      expect(error).toBeDefined();
    });
  });

  describe('record validation', () => {
    it('should reject missing record', () => {
      const body = validBody();
      delete body.record;
      const { error } = helperValidatorsApiScrape.validate(body);
      expect(error).toBeDefined();
    });

    it('should reject empty steps array', () => {
      const body = validBody();
      body.record.steps = [];
      const { error } = helperValidatorsApiScrape.validate(body);
      expect(error).toBeDefined();
    });

    it('should reject steps without a navigate step', () => {
      const body = validBody();
      body.record.steps = [{ type: 'click', selectors: [{ key: 'a', type: 'CSS', value: 'a' }] }];
      const { error } = helperValidatorsApiScrape.validate(body);
      expect(error).toBeDefined();
    });

    it('should reject navigate step without url', () => {
      const body = validBody();
      body.record.steps = [{ type: 'navigate' }];
      const { error } = helperValidatorsApiScrape.validate(body);
      expect(error).toBeDefined();
    });

    it('should reject setViewport without width/height', () => {
      const body = validBody();
      body.record.steps = [
        { type: 'navigate', url: 'https://example.com' },
        { type: 'setViewport' }
      ];
      const { error } = helperValidatorsApiScrape.validate(body);
      expect(error).toBeDefined();
    });

    it('should reject invalid speedMode', () => {
      const body = validBody();
      body.record.speedMode = 'INVALID';
      const { error } = helperValidatorsApiScrape.validate(body);
      expect(error).toBeDefined();
    });

    it('should reject invalid timeoutMode', () => {
      const body = validBody();
      body.record.timeoutMode = 'INVALID';
      const { error } = helperValidatorsApiScrape.validate(body);
      expect(error).toBeDefined();
    });
  });

  describe('responseType vs selectors cross-validation', () => {
    it('should reject RAW with zero selectors', () => {
      const body = validBody();
      body.output.responseType = 'RAW';
      body.capture.selectors = [];
      const { error } = helperValidatorsApiScrape.validate(body);
      expect(error).toBeDefined();
      expect(error.message).toContain('RAW requires exactly one');
    });

    it('should reject RAW with multiple selectors', () => {
      const body = validBody();
      body.output.responseType = 'RAW';
      body.capture.selectors = [
        { key: 'a', type: 'CSS', value: 'h1' },
        { key: 'b', type: 'CSS', value: 'h2' }
      ];
      const { error } = helperValidatorsApiScrape.validate(body);
      expect(error).toBeDefined();
      expect(error.message).toContain('RAW requires exactly one');
    });

    it('should accept RAW with exactly one selector', () => {
      const body = validBody();
      body.output.responseType = 'RAW';
      body.capture.selectors = [{ key: 'a', type: 'CSS', value: 'h1' }];
      const { error } = helperValidatorsApiScrape.validate(body);
      expect(error).toBeUndefined();
    });

    it('should reject JSON with zero selectors', () => {
      const body = validBody();
      body.output.responseType = 'JSON';
      body.capture.selectors = [];
      const { error } = helperValidatorsApiScrape.validate(body);
      expect(error).toBeDefined();
      expect(error.message).toContain('JSON requires at least one');
    });

    it('should accept NONE with zero selectors', () => {
      const body = validBody();
      body.output.responseType = 'NONE';
      body.capture.selectors = [];
      const { error } = helperValidatorsApiScrape.validate(body);
      expect(error).toBeUndefined();
    });

    it('should reject multiple FULL selectors', () => {
      const body = validBody();
      body.capture.selectors = [
        { key: 'a', type: 'FULL', value: 'full' },
        { key: 'b', type: 'FULL', value: 'full' }
      ];
      const { error } = helperValidatorsApiScrape.validate(body);
      expect(error).toBeDefined();
      expect(error.message).toContain('Only one selector with type FULL');
    });

    it('should accept single FULL selector with JSON', () => {
      const body = validBody();
      body.output.responseType = 'JSON';
      body.capture.selectors = [{ key: 'page', type: 'FULL', value: 'full' }];
      const { error } = helperValidatorsApiScrape.validate(body);
      expect(error).toBeUndefined();
    });
  });

  describe('selector validation', () => {
    it('should reject selector without key', () => {
      const body = validBody();
      body.capture.selectors = [{ type: 'CSS', value: 'h1' }];
      const { error } = helperValidatorsApiScrape.validate(body);
      expect(error).toBeDefined();
    });

    it('should reject invalid selector type', () => {
      const body = validBody();
      body.capture.selectors = [{ key: 'x', type: 'INVALID', value: 'h1' }];
      const { error } = helperValidatorsApiScrape.validate(body);
      expect(error).toBeDefined();
    });
  });

  describe('output validation', () => {
    it('should reject invalid responseType', () => {
      const body = validBody();
      body.output.responseType = 'XML';
      const { error } = helperValidatorsApiScrape.validate(body);
      expect(error).toBeDefined();
    });
  });
});
