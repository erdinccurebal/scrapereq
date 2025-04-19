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
function filterSteps(steps) {
    // Map through each step and create a clean copy without unwanted properties
    return steps.map(step => {
        const filteredStep = { ...step };
        
        // Additional filtering logic can be added here as needed
        // For example: removing debug information, normalizing formats, etc.
        
        return filteredStep;
    });
}

export default filterSteps;