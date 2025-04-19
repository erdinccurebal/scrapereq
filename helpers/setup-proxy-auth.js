/**
 * Proxy Authentication Setup Helper
 * 
 * Configures proxy settings with optional authentication for web requests.
 * This utility formats the proxy connection string based on provided configuration.
 * 
 * @param {Object} proxy - Proxy configuration object
 * @param {boolean} proxy.enabled - Whether proxy should be used
 * @param {string} proxy.server - Proxy server hostname or IP address
 * @param {number} proxy.port - Proxy server port number
 * @param {string} [proxy.username] - Optional username for proxy authentication
 * @param {string} [proxy.password] - Optional password for proxy authentication
 * @param {string} [proxy.protocol='http'] - Protocol to use (http, https, socks, etc)
 * @returns {string|null} - Formatted proxy server string or null if proxy is disabled/invalid
 */
export default function (proxy) {
    // Return null if proxy is not provided or not enabled
    if (!proxy || !proxy.enabled) return null;

    // Extract proxy configuration properties
    const { server, port, username, password, protocol } = proxy;
    
    // Return null if essential properties are missing
    if (!server || !port) return null;

    // Build the proxy server string with protocol, defaulting to http if not specified
    let proxyServer = `${protocol || 'http'}://${server}:${port}`;
    
    // Add authentication credentials if provided
    if (username && password) {
        proxyServer = `${protocol || 'http'}://${username}:${password}@${server}:${port}`;
    }

    return proxyServer;
};