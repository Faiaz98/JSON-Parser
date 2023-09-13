const { parse } = require('./parser');
const { tokenize } = require('./tokenizer');

/**
 * prase a JSON string and returns the parsed data.
 * @param {string} jsonString - The JSON string to parse.
 * @returns {Object|Array} - The parsed JSON data.
 * @throws {Error} If the JSON string is invalid.
 */

function parseJson(jsonString) {
    const token = tokenize(jsonString);
    const parsedData = parse(tokens);
    return parsedData;
}

module.exports = {
    parseJson,
};