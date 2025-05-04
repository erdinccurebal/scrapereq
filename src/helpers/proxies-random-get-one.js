/**
 * Random Proxy Selector Helper
 *
 * Randomly selects a proxy from a provided list of proxies.
 * Used for load balancing and distribution of requests across multiple proxies.
 *
 * @param {Object} options - Options object
 * @param {Array} options.proxies - Array of proxy configuration objects
 * @param {string} options.proxies[].server - Proxy server address
 * @param {number} options.proxies[].port - Proxy server port
 * @param {string} [options.proxies[].protocol] - Proxy protocol (e.g., 'http', 'https', 'socks4', 'socks5')
 * @returns {Object} - Randomly selected proxy configuration object
 * @throws {Error} If the proxies array is empty or not provided
 */
export function helperProxiesRandomGetOne({ proxies }) {
  // Validate the proxies array
  if (!Array.isArray(proxies) || proxies.length === 0) {
    throw new Error('Proxy list is empty or not valid');
  }

  // Randomly select a proxy from the provided list
  return proxies[Math.floor(Math.random() * proxies.length)];
}

/**
 * Get a proxy using weighted selection based on success rate
 * This is a more advanced proxy selection that can be implemented
 * when tracking proxy performance metrics
 *
 * @param {Object} options - Options object
 * @param {Array} options.proxies - Array of proxy configuration objects with success rates
 * @param {string} options.proxies[].server - Proxy server address
 * @param {number} options.proxies[].port - Proxy server port
 * @param {number} [options.proxies[].weight=1] - Weight/priority of this proxy (higher = more likely to be chosen)
 * @returns {Object} - Selected proxy configuration object
 * @throws {Error} If the proxies array is empty or not provided
 */
export function helperProxiesWeightedGetOne({ proxies }) {
  // Validate the proxies array
  if (!Array.isArray(proxies) || proxies.length === 0) {
    throw new Error('Proxy list is empty or not valid');
  }

  // If only one proxy, return it directly
  if (proxies.length === 1) {
    return proxies[0];
  }

  // Calculate total weight
  const totalWeight = proxies.reduce((sum, proxy) => sum + (proxy.weight || 1), 0);

  // Get a random value between 0 and totalWeight
  let random = Math.random() * totalWeight;

  // Find the proxy that corresponds to the random value
  for (const proxy of proxies) {
    const weight = proxy.weight || 1;
    if (random < weight) {
      return proxy;
    }
    random -= weight;
  }

  // Fallback to the last proxy (should rarely happen due to math precision)
  return proxies[proxies.length - 1];
}
