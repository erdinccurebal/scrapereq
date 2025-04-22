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
 * @param {string} [proxy.protocol] - Protocol for the proxy (default: "http")
 * @returns {string} - Formatted proxy server string
 * @throws {Error} - Throws an error if proxy configuration is invalid
 */
export function helperSetupProxies(proxies) {
    // Randomly select a proxy from the provided list
    const randomProxy = proxies[Math.floor(Math.random() * proxies.length)];

    // Extract proxy configuration properties
    const { server, port, protocol = "http" } = randomProxy;

    // Build the proxy server string with protocol, defaulting to http if not specified
    const proxyServer = `--proxy-server=${protocol}://${server}:${port}`;

    // Return the formatted proxy configuration
    return proxyServer;
};