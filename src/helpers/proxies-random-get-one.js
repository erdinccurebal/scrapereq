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
    // Randomly select a proxy from the provided list
    return proxies[Math.floor(Math.random() * proxies.length)];
}