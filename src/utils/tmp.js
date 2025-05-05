/**
 * Temporary Directory Management Utility
 *
 * This module provides functionality to set up and manage the temporary directory
 * used for storing screenshots, error captures, and other transient files.
 * It ensures the directory exists and configures Express to serve these files.
 */

// Node core modules
import path from 'path';
import { existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';

// Node third-party modules
import express from 'express';

// Application constants
import { TMP_STATIC_CONFIG } from '../constants.js';

/**
 * Sets up temporary directory access and configures static file serving
 *
 * @param {express.Router} router - Express router instance
 * @returns {string} Path to the temporary directory
 * @throws {Error} When router parameter is missing
 */
export function setupTmp(router) {
  if (!router) {
    throw new Error('setupTmp: Express router instance is required');
  }

  // Get current directory name in ESM context (equivalent to __dirname in CommonJS)
  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  // Define tmp directory path - use environment variable or fallback to default
  const TMP_DIR = process.env.TMP_DIR || path.join(__dirname, '..', '..', 'tmp');

  // Ensure tmp directory exists with proper permissions
  if (!existsSync(TMP_DIR)) {
    try {
      mkdirSync(TMP_DIR, { recursive: true, mode: 0o755 });
      console.log(`Created temporary directory at: ${TMP_DIR}`);
    } catch (error) {
      console.error(`Failed to create temporary directory at ${TMP_DIR}:`, error);
      // Log error but don't crash the application
    }
  }

  // Set up static file serving for the tmp directory
  router.use(
    '/tmp',
    express.static(TMP_DIR, {
      maxAge: TMP_STATIC_CONFIG.MAX_AGE, // Cache control duration
      etag: TMP_STATIC_CONFIG.ETAG, // Enable ETags for caching
      lastModified: TMP_STATIC_CONFIG.LAST_MODIFIED, // Send Last-Modified header
      index: TMP_STATIC_CONFIG.INDEX // Disable directory listing
    })
  );

  return TMP_DIR; // Return the path for usage elsewhere
}
