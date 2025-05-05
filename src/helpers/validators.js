/**
 * Request Validation Schemas
 *
 * This module provides Joi validation schemas for API requests to ensure data integrity and security.
 * The schemas enforce validation rules that align with the API's documented requirements.
 */

import Joi from 'joi';

import {
  SPEED_MODE_NAMES,
  TIMEOUT_MODE_NAMES,
  STEP_TYPES,
  PROXY_PROTOCOLS,
  RESPONSE_TYPE_NAMES,
  SELECTOR_TYPE_NAMES,
  DEFAULT_TITLE,
  DEFAULT_SPEED_MODE,
  DEFAULT_TIMEOUT_MODE,
  DEFAULT_RESPONSE_TYPE,
  BROWSER_CONFIG
} from '../constants.js';

/**
 * Common selector schema definition
 *
 * Reusable schema for selectors used throughout the application
 * to maintain consistency and reduce code duplication.
 */
const selectorSchema = Joi.object({
  key: Joi.string().required(),
  type: Joi.string()
    .valid(SELECTOR_TYPE_NAMES.CSS, SELECTOR_TYPE_NAMES.XPATH, SELECTOR_TYPE_NAMES.FULL)
    .required(),
  value: Joi.string().required()
});

/**
 * Scraper Request Validation Schema
 *
 * Defines the structure and validation rules for incoming scraper API requests.
 * Ensures all required fields are present and validates data types and formats.
 */
export const helperValidatorsApiScrapeStart = Joi.object({
  // Proxy configuration - Controls how requests are routed through proxies
  proxy: Joi.object({
    bypassCode: Joi.string().default(''),
    auth: Joi.object({
      enabled: Joi.boolean().required(),
      username: Joi.string().required(),
      password: Joi.string().required()
    }).default({
      enabled: false,
      username: null,
      password: null
    }),
    servers: Joi.array()
      .items(
        Joi.object({
          server: Joi.string().required(),
          port: Joi.number().required(),
          protocol: Joi.string()
            .valid(
              PROXY_PROTOCOLS.HTTP,
              PROXY_PROTOCOLS.HTTPS,
              PROXY_PROTOCOLS.SOCKS4,
              PROXY_PROTOCOLS.SOCKS5
            )
            .default(PROXY_PROTOCOLS.HTTP)
        })
      )
      .default([])
  }).required(),

  // Record configuration - Defines the scraping behavior and execution parameters
  record: Joi.object({
    title: Joi.string().required().default(DEFAULT_TITLE),
    speedMode: Joi.string()
      .valid(
        SPEED_MODE_NAMES.TURBO,
        SPEED_MODE_NAMES.FAST,
        SPEED_MODE_NAMES.NORMAL,
        SPEED_MODE_NAMES.SLOW,
        SPEED_MODE_NAMES.SLOWEST,
        SPEED_MODE_NAMES.CRAWL,
        SPEED_MODE_NAMES.STEALTH
      )
      .default(DEFAULT_SPEED_MODE),
    timeoutMode: Joi.string()
      .valid(TIMEOUT_MODE_NAMES.SHORT, TIMEOUT_MODE_NAMES.NORMAL, TIMEOUT_MODE_NAMES.LONG)
      .default(DEFAULT_TIMEOUT_MODE),

    // Scraper step definitions - Sequence of actions to perform during scraping
    steps: Joi.array()
      .items(
        Joi.object({
          // Core step properties
          type: Joi.string()
            .valid(
              STEP_TYPES.NAVIGATE,
              STEP_TYPES.CLICK,
              STEP_TYPES.WAIT,
              STEP_TYPES.SET_VIEWPORT,
              STEP_TYPES.CHANGE,
              STEP_TYPES.WAIT_FOR_ELEMENT
            )
            .required(),

          // Conditional validation for different step types
          ...(() => {
            // Create a schema that supports all step types dynamically
            return {
              // Common fields that apply to specific step types
              selectors: Joi.array().items(selectorSchema),
              url: Joi.string().uri(),
              value: Joi.string().allow(''),
              duration: Joi.number(),
              timeout: Joi.number(),

              // Viewport settings for setViewport
              width: Joi.number(),
              height: Joi.number(),
              deviceScaleFactor: Joi.number(),
              isMobile: Joi.boolean(),
              hasTouch: Joi.boolean(),
              isLandscape: Joi.boolean(),

              // Click options
              offsetX: Joi.number(),
              offsetY: Joi.number(),
              button: Joi.string().valid('left', 'right', 'middle')
            };
          })()
        })
      )
      .custom((steps, helpers) => {
        // Validate: at least one navigate step is required
        const hasNavigateStep = steps.some((step) => step.type === STEP_TYPES.NAVIGATE && step.url);

        if (!hasNavigateStep) {
          return helpers.error('array.base', {
            message: 'At least one navigate step with a valid URL is required'
          });
        }

        // Validate type-specific requirements for each step
        for (const [index, step] of steps.entries()) {
          if (step.type === STEP_TYPES.SET_VIEWPORT) {
            if (!step.width || !step.height) {
              return helpers.error('object.base', {
                message: `setViewport step ${index + 1} requires width and height properties`
              });
            }
          } else if (step.type === STEP_TYPES.NAVIGATE) {
            if (!step.url) {
              return helpers.error('object.base', {
                message: `navigate step ${index + 1} requires a valid URL`
              });
            }
          } else if (
            step.type === STEP_TYPES.CLICK ||
            step.type === STEP_TYPES.CHANGE ||
            step.type === STEP_TYPES.WAIT_FOR_ELEMENT
          ) {
            if (!step.selectors || step.selectors.length === 0) {
              return helpers.error('object.base', {
                message: `${step.type} step ${index + 1} requires at least one selector`
              });
            }
          } else if (step.type === STEP_TYPES.WAIT) {
            if (step.duration === undefined) {
              return helpers.error('object.base', {
                message: `wait step ${index + 1} requires a duration value`
              });
            }
          }
        }

        return steps;
      })
      .required()
  }).required(),

  // Capture configuration - Defines what data should be extracted during scraping
  capture: Joi.object({
    request: Joi.object({
      data: Joi.array()
        .items(
          Joi.object({
            key: Joi.string().required(),
            address: Joi.string().uri().required(),
            method: Joi.string().required()
          })
        )
        .default([]),
      queries: Joi.array()
        .items(
          Joi.object({
            key: Joi.string().required(),
            address: Joi.string().uri().required(),
            method: Joi.string().required()
          })
        )
        .default([])
    }).default({ data: [], queries: [] }),
    response: Joi.object({
      cookies: Joi.array().items(Joi.string()).default([]),
      data: Joi.array()
        .items(
          Joi.object({
            key: Joi.string().required(),
            address: Joi.string().uri().required(),
            method: Joi.string().required()
          })
        )
        .default([])
    }).default({ cookies: [], data: [] }),
    selectors: Joi.array().items(selectorSchema).default([])
  }).default({
    request: { data: [], queries: [] },
    response: { cookies: [], data: [] },
    selectors: []
  }),

  // Headers configuration - Controls browser request headers
  headers: Joi.object({
    'Accept-Language': Joi.string().default(BROWSER_CONFIG.ACCEPT_LANGUAGE),
    'User-Agent': Joi.string().default(BROWSER_CONFIG.USER_AGENT)
  }).default({
    'Accept-Language': BROWSER_CONFIG.ACCEPT_LANGUAGE,
    'User-Agent': BROWSER_CONFIG.USER_AGENT
  }),

  // Output configuration - Controls how results are returned to the client
  output: Joi.object({
    screenshots: Joi.object({
      onError: Joi.boolean().default(true),
      onSuccess: Joi.boolean().default(false)
    }).default({
      onError: true,
      onSuccess: false
    }),
    responseType: Joi.string()
      .valid(RESPONSE_TYPE_NAMES.NONE, RESPONSE_TYPE_NAMES.JSON, RESPONSE_TYPE_NAMES.RAW)
      .default(DEFAULT_RESPONSE_TYPE)
  }).default({
    screenshots: {
      onError: true,
      onSuccess: false
    },
    responseType: DEFAULT_RESPONSE_TYPE
  })
});
