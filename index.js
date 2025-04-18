require('dotenv').config();

const express = require('express');
const basicAuth = require('express-basic-auth');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to enable CORS
app.use(cors({
    origin: '*', // Allow all origins for simplicity; adjust as needed
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// JSON parsing middleware
app.use(express.json({ limit: '50mb' }));

// Basic auth middleware
app.use(basicAuth({
    users: {
        [process.env.AUTH_USERNAME || 'admin']: process.env.AUTH_PASSWORD || '123456'
    },
    challenge: true,
    realm: 'Web Scraping API'
}));

// Proxy auth setup function
const setupProxyAuth = (proxy) => {
    if (!proxy || !proxy.enabled) return null;

    const { server, port, username, password, protocol } = proxy;
    if (!server || !port) return null;

    let proxyServer = `${protocol || 'http'}://${server}:${port}`;
    if (username && password) {
        proxyServer = `${protocol || 'http'}://${username}:${password}@${server}:${port}`;
    }

    return proxyServer;
};

// Main scraping route
app.post('/run', async (req, res) => {
    const { steps, proxy, cssSelector, xPathSelector } = req.body;

    if (!steps || !Array.isArray(steps)) {
        return res.status(400).json({
            status: 'error',
            code: 400,
            message: 'Steps array is required in the request body'
        });
    }

    let browser = null;
    let page = null;

    try {
        // Setup browser with proxy if provided
        const proxyServer = setupProxyAuth(proxy);
        const launchOptions = {
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        };

        if (proxyServer) {
            launchOptions.args.push(`--proxy-server=${proxyServer}`);
        }

        browser = await puppeteer.launch(launchOptions);
        page = await browser.newPage();

        // Execute each step in order
        for (const step of steps) {
            await executeStep(page, step);
        }

        // Get selectors data if provided
        let result = {
            status: 'success',
            code: 200,
            message: 'Scraping completed successfully',
            data: {}
        };

        // Process CSS selector if enabled
        if (cssSelector && cssSelector.enabled && cssSelector.value) {
            try {
                const cssResult = await page.evaluate((selector) => {
                    const element = document.querySelector(selector);
                    return element ? element.textContent.trim() : null;
                }, cssSelector.value);

                result.data.cssSelector = cssResult;
            } catch (error) {
                result.data.cssSelector = { error: error.message };
            }
        }

        // Process XPath selector if enabled
        if (xPathSelector && xPathSelector.enabled && xPathSelector.value) {
            try {
                // Remove 'xpath//' prefix if it exists
                const xpathValue = xPathSelector.value.replace(/^xpath\/\//, '');
                const xpathResult = await page.evaluate((xpath) => {
                    const element = document.evaluate(
                        xpath,
                        document,
                        null,
                        XPathResult.FIRST_ORDERED_NODE_TYPE,
                        null
                    ).singleNodeValue;
                    return element ? element.textContent.trim() : null;
                }, xpathValue);

                result.data.xPathSelector = xpathResult;
            } catch (error) {
                result.data.xPathSelector = { error: error.message };
            }
        }

        // Get the current URL after all steps
        result.data.finalUrl = page.url();

        // Get the page title
        result.data.pageTitle = await page.title();

        res.json(result);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            code: 500,
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    } finally {
        if (page) await page.close();
        if (browser) await browser.close();
    }
});

// Function to execute a step based on its type
async function executeStep(page, step) {
    const { type } = step;

    switch (type) {
        case 'navigate':
            await page.goto(step.url, { waitUntil: 'networkidle2', timeout: 30000 });
            break;

        case 'setViewport':
            await page.setViewport({
                width: step.width || 1280,
                height: step.height || 800,
                deviceScaleFactor: step.deviceScaleFactor || 1,
                isMobile: step.isMobile || false,
                hasTouch: step.hasTouch || false,
                isLandscape: step.isLandscape || false
            });
            break;

        case 'click':
            await clickElement(page, step);
            break;

        case 'type':
            await typeText(page, step);
            break;

        case 'wait':
            if (step.timeout) {
                await page.waitForTimeout(step.timeout);
            } else if (step.selector) {
                await page.waitForSelector(step.selector, { timeout: step.timeoutMs || 30000 });
            }
            break;

        case 'screenshot':
            await page.screenshot({ path: step.path || 'screenshot.png', fullPage: step.fullPage || false });
            break;

        default:
            throw new Error(`Unsupported step type: ${type}`);
    }
}

// Helper function for click operations
async function clickElement(page, step) {
    if (!step.selectors || !Array.isArray(step.selectors) || step.selectors.length === 0) {
        throw new Error('No selectors provided for click step');
    }

    // Try each selector in order until one works
    for (const selectorGroup of step.selectors) {
        try {
            if (!selectorGroup || selectorGroup.length === 0) continue;

            const selector = selectorGroup[0];

            if (selector.startsWith('xpath//')) {
                // Handle XPath selectors
                const xpath = selector.replace('xpath//', '');
                await page.waitForXPath(xpath, { timeout: 5000 });
                const elements = await page.$x(xpath);
                if (elements.length > 0) {
                    await elements[0].click({
                        offset: {
                            x: step.offsetX,
                            y: step.offsetY
                        }
                    });
                    return;
                }
            } else if (selector.startsWith('aria/')) {
                // Handle ARIA selectors (simple implementation)
                const ariaText = selector.replace('aria/', '');
                await page.waitForFunction(
                    (text) => {
                        return Array.from(document.querySelectorAll('*')).find(
                            el => el.getAttribute('aria-label') === text || el.textContent.includes(text)
                        );
                    },
                    { timeout: 5000 },
                    ariaText
                );

                await page.evaluate((text) => {
                    const el = Array.from(document.querySelectorAll('*')).find(
                        el => el.getAttribute('aria-label') === text || el.textContent.includes(text)
                    );
                    if (el) el.click();
                }, ariaText);

                return;
            } else if (selector.startsWith('text/')) {
                // Handle text selectors
                const text = selector.replace('text/', '');
                await page.waitForFunction(
                    (text) => {
                        return Array.from(document.querySelectorAll('*')).find(
                            el => el.textContent.includes(text)
                        );
                    },
                    { timeout: 5000 },
                    text
                );

                await page.evaluate((text) => {
                    const el = Array.from(document.querySelectorAll('*')).find(
                        el => el.textContent.includes(text)
                    );
                    if (el) el.click();
                }, text);

                return;
            } else {
                // Handle CSS selectors
                await page.waitForSelector(selector, { timeout: 5000 });
                const element = await page.$(selector);
                if (element) {
                    await element.click({
                        offset: {
                            x: step.offsetX,
                            y: step.offsetY
                        }
                    });
                    return;
                }
            }
        } catch (error) {
            // Continue to the next selector if current one failed
            continue;
        }
    }

    throw new Error('None of the provided selectors worked for click operation');
}

// Helper function for typing text
async function typeText(page, step) {
    const { selector, text, delay } = step;

    try {
        await page.waitForSelector(selector, { timeout: 5000 });
        await page.type(selector, text, { delay: delay || 50 });
    } catch (error) {
        throw new Error(`Failed to type text: ${error.message}`);
    }
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});