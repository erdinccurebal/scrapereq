/**
 * Formats uptime in seconds into a human-readable string (e.g., "2d 5h 30m 10s")
 * @param {number} uptime - Uptime in seconds
 * @returns {string} Formatted uptime string (e.g., "2d 5h 30m 10s")
 * @throws {TypeError} Throws if the uptime is not a number
 */
export function helperFormatUptime(uptime) {
  // Validate input type
  if (typeof uptime !== 'number' || Number.isNaN(uptime)) {
    throw new TypeError('Uptime must be a valid number');
  }

  const days = Math.floor(uptime / 86400);
  const hours = Math.floor((uptime % 86400) / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

  return parts.join(' ');
}
