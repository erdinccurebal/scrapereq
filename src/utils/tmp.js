// Node core modules
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Node third-party modules
import express from 'express';

export function setupTmp(router) {
    if (!router) {
        throw new Error('Express router instance is required');
    }

    /**
    * Get directory name in ES module context
    * Equivalent to __dirname in CommonJS
    */
    const __dirname = path.dirname(fileURLToPath(import.meta.url));

    /**
     * Define tmp directory path, using env variable or default to local path
     * This directory is used for storing screenshots and other temporary files
     */
    const TMP_DIR = process.env.TMP_DIR || path.join(__dirname, '..', '..', '..', 'tmp');

    // Ensure tmp directory exists
    if (!fs.existsSync(TMP_DIR)) {
        try {
            fs.mkdirSync(TMP_DIR, { recursive: true });
            console.log(`Created TMP_DIR at: ${TMP_DIR}`);
        } catch (error) {
            console.error(`Failed to create TMP_DIR at ${TMP_DIR}:`, error);
        }
    }

    router.use('/tmp', express.static(TMP_DIR));
}