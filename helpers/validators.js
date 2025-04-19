/**
 * Request Validation Schemas
 * 
 * This module provides validation schemas for API requests
 * using Joi validation library to ensure data integrity and security.
 */

// Node modules
import Joi from 'joi';

/**
 * Scraper Request Validation Schema
 * 
 * Defines the expected structure and validation rules for incoming scraper requests.
 * Ensures all required fields are present and properly formatted before processing.
 */
const scraperRequestSchema = Joi.object({
    // Title of the scraping task - required for identification
    title: Joi.string().required(),
    
    // Array of steps to be executed by the scraper
    steps: Joi.array().items(
        Joi.object({
            // Step type (navigate, click, wait, etc.)
            type: Joi.string().valid('navigate', 'click', 'wait', 'setViewport'),
            
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
            (step.type === 'navigate' || step.process === 'navigate') &&
            (step.url || step.value)
        );

        if (!hasNavigateStep) {
            return helpers.error('array.base', { message: 'At least one navigate step with a valid URL is required' });
        }

        // Validate all navigate step URLs to ensure they're properly formatted
        const navigateSteps = steps.filter(step => step.type === 'navigate' || step.process === 'navigate');

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
        protocol: Joi.string().valid('http', 'https', 'socks4', 'socks5')
    })
});

export { scraperRequestSchema };