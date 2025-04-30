/**
 * Proxy Authentication Setup Helper
 * 
 * Configures proxy settings with optional authentication for web requests.
 * This utility formats the proxy connection string based on provided configuration.
 * 
 * @param {Object} proxy - Proxy configuration object
 * @param {string} proxy.server - Proxy server address
 * @param {number} proxy.port - Proxy server port
 * @param {string} [proxy.username] - Username for proxy authentication (optional)
 * @param {string} [proxy.password] - Password for proxy authentication (optional)
 * @param {string} [proxy.protocol] - Proxy protocol (e.g., 'http', 'https') (optional)
 * @returns {object} - Formatted proxy configuration object
 * @throws {Error} If proxy server or port is not provided
 */
export function helperProxiesRandomGetOne({ proxies }) {
    // Randomly select a proxy from the provided list
    return proxies[Math.floor(Math.random() * proxies.length)];
};