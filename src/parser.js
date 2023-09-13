/**
 * Parses a JSON array of tokens into an object or array.
 * @param {Array} tokens - An array of tokens.
 * @returns {Object|Array} - The parsed JSON data.
 * @throws {Error} If the JSON is invalid.
 */

function parse(tokens) {
    const jsonString = tokens.join('');
    try {
        const parsedData = JSON.parse(jsonString);
        return parsedData;
    } catch (error) {
        throw new Error('Invalid JSON format');
    }
}

module.exports = {
    parse,
};