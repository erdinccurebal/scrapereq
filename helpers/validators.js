/**
 * Request Validation Schemas
 * 
 * This module provides validation schemas for API requests
 * using Joi validation library to ensure data integrity and security.
 */

// Node modules
import Joi from 'joi';

// Import constants
import { SPEED_MODE_NAMES, TIMEOUTS_MODE_NAMES, STEP_TYPES, PROXY_PROTOCOLS, RESPONSE_TYPE_NAMES, SELECTOR_TYPE_NAMES } from '../constants.js';

/**
 * Scraper Request Validation Schema
 * 
 * Defines the expected structure and validation rules for incoming scraper requests.
 * Ensures all required fields are present and properly formatted before processing.
 */
const scraperRequestSchema = Joi.object({
    // Title of the scraping task - required for identification
    title: Joi.string().required(),

    // Speed mode for controlling scraper execution pace (TURBO, FAST, NORMAL, SLOW, SLOWEST, CRAWL, STEALTH)
    speedMode: Joi.string().valid(
        SPEED_MODE_NAMES.TURBO,
        SPEED_MODE_NAMES.FAST,
        SPEED_MODE_NAMES.NORMAL,
        SPEED_MODE_NAMES.SLOW,
        SPEED_MODE_NAMES.SLOWEST,
        SPEED_MODE_NAMES.CRAWL,
        SPEED_MODE_NAMES.STEALTH
    ),

    // Error handling options
    // errorSnapshot: boolean to indicate if a snapshot should be taken on error
    errorScreenshot: Joi.boolean(),

    // successSnapshot: boolean to indicate if a snapshot should be taken on success
    // This is optional and defaults to false if not provided
    successScreenshot: Joi.boolean(),

    // Timeout mode for controlling scraper execution time (SHORT, NORMAL, LONG)
    timeoutMode: Joi.string().valid(
        TIMEOUTS_MODE_NAMES.SHORT,
        TIMEOUTS_MODE_NAMES.NORMAL,
        TIMEOUTS_MODE_NAMES.LONG
    ),

    // Response type for the scraper output (NONE, JSON, RAW)
    responseType: Joi.string().valid(
        RESPONSE_TYPE_NAMES.NONE,
        RESPONSE_TYPE_NAMES.JSON,
        RESPONSE_TYPE_NAMES.RAW
    ),

    // Array of CSS or XPath selectors for targeting elements on the page
    // Each selector must have a key, type (CSS/XPath), and value
    selectors: Joi.array().items(
        Joi.object({
            key: Joi.string().required(),
            type: Joi.string().valid(
                SELECTOR_TYPE_NAMES.CSS,
                SELECTOR_TYPE_NAMES.XPATH,
                SELECTOR_TYPE_NAMES.FULL
            ).required(),
            value: Joi.string().required(),
        })).when('responseType', {
            is: RESPONSE_TYPE_NAMES.NONE,
            then: Joi.forbidden().error(new Error('Selectors cannot be provided when responseType is NONE')),
            otherwise: Joi.array().items(
                Joi.object({
                    key: Joi.string().required(),
                    type: Joi.string().valid(
                        SELECTOR_TYPE_NAMES.CSS,
                        SELECTOR_TYPE_NAMES.XPATH,
                        SELECTOR_TYPE_NAMES.FULL
                    ).required(),
                    value: Joi.string().required(),
                })
            ).custom((selectors, helpers) => {
                // Check if there's more than one FULL type selector
                const fullSelectors = selectors.filter(selector => selector.type === SELECTOR_TYPE_NAMES.FULL);
                if (fullSelectors.length > 1) {
                    return helpers.error('array.base', {
                        message: 'Only one selector with type FULL is allowed'
                    });
                }

                // Check if responseType is RAW, only allow one selector
                const responseType = helpers.state.ancestors[0].responseType;
                if (responseType === RESPONSE_TYPE_NAMES.RAW && selectors.length > 1) {
                    return helpers.error('array.base', {
                        message: 'Only one selector is allowed when responseType is RAW'
                    });
                }

                return selectors;
            })
        }),

    // Optional fields for additional configuration
    acceptLanguage: Joi.string(),
    userAgent: Joi.string(),

    // Array of steps to be executed by the scraper
    steps: Joi.array().items(
        Joi.object({
            // Step type - specific allowed types only
            type: Joi.string().valid(
                STEP_TYPES.NAVIGATE,
                STEP_TYPES.CLICK,
                STEP_TYPES.WAIT,
                STEP_TYPES.SET_VIEWPORT,
                STEP_TYPES.CHANGE,
                STEP_TYPES.WAIT_FOR_ELEMENT
            ).required(),

            // Generic value field, used differently based on step type
            value: Joi.string().allow(''),

            // URL for navigation steps
            url: Joi.string().uri().allow(''),

            // CSS selectors for targeting elements - farklı formatlarda olabilir
            selectors: Joi.array(),

            // Click position offset coordinates
            offsetX: Joi.number(),
            offsetY: Joi.number(),

            // Viewport dimensions for setViewport steps
            width: Joi.number(),
            height: Joi.number(),
            deviceScaleFactor: Joi.number(),

            // Device emulation settings
            isMobile: Joi.boolean(),
            hasTouch: Joi.boolean(),
            isLandscape: Joi.boolean(),

            // Timeout value for operations
            timeout: Joi.number(),

            // Target for step operations
            target: Joi.string(),

            // Frame identifier for actions in iframes - string veya array olabilir
            frame: Joi.alternatives().try(Joi.string(), Joi.array()),

            // Duration settings for interactions
            duration: Joi.number(),

            // Device type for emulation
            deviceType: Joi.string(),

            // Mouse button for click actions
            button: Joi.string(),

            // Operator for comparison operations
            operator: Joi.string(),

            // Count for repeating operations
            count: Joi.number(),

            // Visibility flag for element actions
            visible: Joi.boolean(),

            // Element attributes for selection
            attributes: Joi.object(),

            // Element properties for inspection
            properties: Joi.object(),

            // Events that should be asserted after step execution
            assertedEvents: Joi.array().items(Joi.object()),
        })
    ).custom((steps, helpers) => {
        // Custom validation: Check for at least one navigate step
        const hasNavigateStep = steps.some(step =>
            (step.type === STEP_TYPES.NAVIGATE) &&
            (step.url || step.value)
        );

        if (!hasNavigateStep) {
            return helpers.error('array.base', { message: 'At least one navigate step with a valid URL is required' });
        }

        // Validate all navigate step URLs to ensure they're properly formatted
        const navigateSteps = steps.filter(step => step.type === STEP_TYPES.NAVIGATE);

        for (const [index, step] of navigateSteps.entries()) {
            const url = step.url || step.value;
            const urlSchema = Joi.string().uri();
            const { error } = urlSchema.validate(url);

            if (error) {
                return helpers.error('array.base', {
                    message: `Invalid URL in navigate step ${index + 1}: ${url}`
                });
            }
        }

        return steps;
    }).required(),

    // Optional proxy configuration for web requests
    proxy: Joi.object({
        enabled: Joi.boolean().required(),
        server: Joi.string().required(),
        port: Joi.number().required(),
        username: Joi.string(),
        password: Joi.string(),
        protocol: Joi.string().valid(
            PROXY_PROTOCOLS.HTTP,
            PROXY_PROTOCOLS.HTTPS,
            PROXY_PROTOCOLS.SOCKS4,
            PROXY_PROTOCOLS.SOCKS5
        )
    })
});

export { scraperRequestSchema };