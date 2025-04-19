/**
 * Request Validation Schemas
 * 
 * This module provides validation schemas for API requests
 * using Joi validation library to ensure data integrity and security.
 */

// Node modules
import Joi from 'joi';

// Import constants
import { SPEED_MODE_NAMES, TIMEOUTS_MODE_NAMES, STEP_TYPES, PROXY_PROTOCOLS } from '../constants.js';

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

    timeoutMode: Joi.string().valid(
        TIMEOUTS_MODE_NAMES.SHORT,
        TIMEOUTS_MODE_NAMES.NORMAL,
        TIMEOUTS_MODE_NAMES.LONG
    ),
    
    // Array of steps to be executed by the scraper
    steps: Joi.array().items(
        Joi.object({
            // Step type (navigate, click, wait, etc.)
            type: Joi.string().valid(
                STEP_TYPES.NAVIGATE, 
                STEP_TYPES.CLICK, 
                STEP_TYPES.WAIT, 
                STEP_TYPES.SET_VIEWPORT
            ),
            
            // Generic value field, used differently based on step type
            value: Joi.string().allow(''),
            
            // URL for navigation steps
            url: Joi.string().uri().allow(''),
            
            // CSS selectors for targeting elements
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
            
            // Optional fields for compatibility with recorder output
            assertedEvents: Joi.array().items(Joi.object()).optional(),
            target: Joi.string().optional(),
        }).or('type', 'process')
    ).custom((steps, helpers) => {
        // Custom validation: Check for at least one navigate step
        const hasNavigateStep = steps.some(step =>
            (step.type === STEP_TYPES.NAVIGATE || step.process === STEP_TYPES.NAVIGATE) &&
            (step.url || step.value)
        );

        if (!hasNavigateStep) {
            return helpers.error('array.base', { message: 'At least one navigate step with a valid URL is required' });
        }

        // Validate all navigate step URLs to ensure they're properly formatted
        const navigateSteps = steps.filter(step => step.type === STEP_TYPES.NAVIGATE || step.process === STEP_TYPES.NAVIGATE);

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
        enabled: Joi.boolean(),
        server: Joi.string(),
        port: Joi.number(),
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