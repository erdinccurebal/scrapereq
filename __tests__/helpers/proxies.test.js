import { helperProxiesRandomGetOne } from '../../src/helpers/proxies-random-get-one.js';

describe('helperProxiesRandomGetOne', () => {
  it('should return a proxy from the list', () => {
    const servers = [
      { server: 'proxy1.com', port: 8080 },
      { server: 'proxy2.com', port: 8081 }
    ];
    const result = helperProxiesRandomGetOne({ servers });
    expect(servers).toContainEqual(result);
  });

  it('should return the only proxy when list has one item', () => {
    const servers = [{ server: 'proxy1.com', port: 8080 }];
    const result = helperProxiesRandomGetOne({ servers });
    expect(result).toEqual(servers[0]);
  });

  it('should throw when servers array is empty', () => {
    expect(() => helperProxiesRandomGetOne({ servers: [] })).toThrow(
      'Proxy list is empty or not valid'
    );
  });

  it('should throw when servers is not an array', () => {
    expect(() => helperProxiesRandomGetOne({ servers: null })).toThrow(
      'Proxy list is empty or not valid'
    );
  });

  it('should throw when servers is undefined', () => {
    expect(() => helperProxiesRandomGetOne({})).toThrow('Proxy list is empty or not valid');
  });
});
