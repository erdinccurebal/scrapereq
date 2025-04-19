/**
 * Puppeteer Health Check Helper
 * Tests if Puppeteer can successfully launch and navigate to a test page
 * Returns the status of Puppeteer's functionality
 */

import puppeteer from 'puppeteer';

/**
 * Simple test to check if Puppeteer can launch and perform basic navigation
 * @returns {Promise<Object>} Status object with success flag and additional info
 */
export default async function checkPuppeteerHealth() {
    let browser = null;
    
    try {
        // Launch browser with minimal options for quick testing
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        // Open a new page
        const page = await browser.newPage();
        
        // Navigate to a reliable test page (Google)
        await page.goto('https://www.google.com', {
            waitUntil: 'networkidle2',
            timeout: 10000 // Shorter timeout for health check
        });
        
        // Get the page title to verify successful navigation
        const title = await page.title();
        
        return {
            success: true,
            puppeteerStatus: 'operational',
            version: puppeteer.version(),
            test: {
                pageTitle: title,
                testPage: 'https://www.google.com'
            }
        };
    } catch (error) {
        return {
            success: false,
            puppeteerStatus: 'error',
            errorMessage: error.message,
            version: puppeteer.version()
        };
    } finally {
        // Always clean up the browser instance
        if (browser) {
            await browser.close();
        }
    }
}