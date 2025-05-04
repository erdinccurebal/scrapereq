/**
 * Screenshot Cleanup Helper
 * Removes screenshot files from the tmp directory that are older than 24 hours
 */

// Node core modules
import fs from 'fs';
import path from 'path';

/**
 * Extracts date from screenshot filename
 *
 * @param {string} filename - Screenshot filename (e.g. "error-2025-03-20T00-12-26-829Z.png")
 * @returns {Date|null} - Date object or null if date couldn't be extracted
 * @throws {Error} - Throws error if filename format is invalid
 */
function extractDateFromFilename(filename) {
  try {
    // Match full date pattern in our screenshot filenames (including time)
    const dateMatch = filename.match(
      /-([\d]{4})-([\d]{2})-([\d]{2})T([\d]{2})-([\d]{2})-([\d]{2})-/
    );
    if (!dateMatch) return null;

    const year = parseInt(dateMatch[1]);
    const month = parseInt(dateMatch[2]) - 1; // JS months are 0-based
    const day = parseInt(dateMatch[3]);
    const hours = parseInt(dateMatch[4]);
    const minutes = parseInt(dateMatch[5]);
    const seconds = parseInt(dateMatch[6]);

    // Create date from extracted components as UTC
    // Use Date.UTC to create the date in UTC timezone
    const timestamp = Date.UTC(year, month, day, hours, minutes, seconds);
    const date = new Date(timestamp);

    // Check if date is valid
    if (isNaN(date.getTime())) return null;

    return date;
  } catch (error) {
    console.error(`Error extracting date from filename ${filename}:`, error);
    return null;
  }
}

/**
 * Cleans up screenshot files older than the specified retention period
 *
 * @param {number} retentionHours - Hours to keep files before deletion (default: 24)
 * @returns {Promise<{deleted: number, errors: number}>} Statistics about the cleanup operation
 * @throws {Error} - Throws error if cleanup fails
 */
export async function helperCleanupOldScreenshots(retentionHours = 24) {
  try {
    console.log(`Starting screenshot cleanup (retention period: ${retentionHours} hours)`);

    // Use TMP_DIR from environment or fallback to default
    const screenshotDir = process.env.TMP_DIR || path.join(process.cwd(), 'tmp');

    if (!fs.existsSync(screenshotDir)) {
      console.log(
        `Screenshot directory does not exist at path: ${screenshotDir}. Nothing to clean up.`
      );
      return { deleted: 0, errors: 0 };
    }

    // Calculate cutoff time (current time minus retention period)
    const now = new Date();
    const cutoffTime = new Date(now.getTime() - retentionHours * 60 * 60 * 1000);

    console.log(`Cutoff time for deletion: ${cutoffTime.toISOString()}`);
    console.log('Files older than this time will be deleted.');

    // Get all files in the tmp directory
    const files = fs.readdirSync(screenshotDir);

    let deletedCount = 0;
    let errorCount = 0;

    // Check each file
    for (const file of files) {
      // Only process screenshot PNG files
      if (!(file.startsWith('success-') || file.startsWith('error-')) || !file.endsWith('.png')) {
        continue;
      }

      const filePath = path.join(screenshotDir, file);

      try {
        // Try two methods to determine file age:
        // 1. File modification time from the filesystem
        const stats = fs.statSync(filePath);
        const fileModificationTime = new Date(stats.mtime);

        // 2. Date from the filename itself (more reliable for our naming convention)
        const fileNameDate = extractDateFromFilename(file);

        // Use filename date if available, otherwise use modification time
        const fileCreationTime = fileNameDate || fileModificationTime;

        // Debug output
        console.log(`File: ${file}`);
        console.log(`  - Filesystem date: ${fileModificationTime.toISOString()}`);
        console.log(
          `  - Filename date: ${fileNameDate ? fileNameDate.toISOString() : 'Not available'}`
        );
        console.log(`  - Using date: ${fileCreationTime.toISOString()}`);

        // If file is older than the cutoff time, delete it
        if (fileCreationTime < cutoffTime) {
          fs.unlinkSync(filePath);
          deletedCount++;
          console.log(
            `Deleted old screenshot: ${file} (created: ${fileCreationTime.toISOString()})`
          );
        } else {
          console.log(`Keeping file: ${file} (created: ${fileCreationTime.toISOString()})`);
        }
      } catch (error) {
        errorCount++;
        console.error(`Error processing file ${file}:`, error.message);
      }
    }

    console.log(
      `Screenshot cleanup completed. Deleted ${deletedCount} files. Errors: ${errorCount}`
    );
    return { deleted: deletedCount, errors: errorCount };
  } catch (error) {
    console.error('Error during screenshot cleanup:', error);
    throw error;
  }
}
