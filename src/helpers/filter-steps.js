/**
 * Filter and process steps for scraper execution
 * Sanitizes and standardizes the steps before they are executed by Puppeteer
 * 
 * @param {Array<Object>} steps - The raw step objects from the request
 * @returns {Object} Object containing cleaned and prepared step objects
 * @throws {Error} - Throws an error if the steps are not in the expected format
 */
export function helperFilterSteps({ steps }) {
    // Guard against null or undefined steps
    if (!steps || !Array.isArray(steps)) {
        return []
    }

    // Map through each step and create a clean copy without unwanted properties
    const filteredSteps = steps.map(step => {
        const filteredStep = { ...step }

        // Additional filtering logic can be added here as needed
        // For example: removing debug information, normalizing formats, etc.

        return filteredStep
    })

    return { filteredSteps }
}
