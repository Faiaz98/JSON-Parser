/**
 * Tokenizes a JSON string into an array of tokens.
 * @param {string} jsonString - The JSON string to tokenize.
 * @returns {Array} - An array of tokens.
 */

function tokenize(jsonString) {
    return jsonString.split(/(\s*[\[\]{},:"]\s*)/).filter(token => !token.match(/^\s*$/));
}

module.exports = {
    tokenize,
};