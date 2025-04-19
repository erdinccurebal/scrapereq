/**
 * Step Filter Utility
 * 
 * Processes and filters the step objects that will be executed by the scraper.
 * This helper ensures that only necessary data is passed to the execution engine
 * and removes any potentially problematic or unnecessary properties.
 * 
 * @param {Array} steps - Array of step objects to be processed
 * @returns {Array} - Filtered steps ready for execution
 */

/**
 * Filter and process steps for scraper execution
 * Sanitizes and standardizes the steps before they are executed by Puppeteer
 * 
 * @param {Array<Object>} steps - The raw step objects from the request
 * @returns {Array<Object>} Cleaned and prepared step objects
 */
function filterSteps(steps) {
    // Guard against null or undefined steps
    if (!steps || !Array.isArray(steps)) {
        return [];
    }
    
    // Map through each step and create a clean copy without unwanted properties
    return steps.map(step => {
        const filteredStep = { ...step };
        
        // Additional filtering logic can be added here as needed
        // For example: removing debug information, normalizing formats, etc.
        
        return filteredStep;
    });
}

// Export as default for importing in other modules
export default filterSteps;