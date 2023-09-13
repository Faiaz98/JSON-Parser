/**
 * Parses a JSON array of tokens into an object or array.
 * @param {Array} tokens - An array of tokens.
 * @returns {Object|Array} - The parsed JSON data.
 * @throws {Error} If the JSON is invalid.
 */

class JSONParseError extends Error {
    constructor(message) {
        super(message);
        this.name = 'JSONParseError';
    }
}

function parse(tokens) {
    const jsonString = tokens.join('');
    try {
        const parsedData = JSON.parse(jsonString, (key, value) => {
            if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(value)) {
                return new Date(value);
            }
            // custom deserialization for regular expressions
            if (value && typeof value === 'object' && value['__regex__'] === true) {
                return new RegExp(value.source, value.flags);
            }
            return value;
        });
        return parsedData;
    } catch (error) {
        throw new JSONParseError('Invalid JSON format');
    }
}

function stringify(data) {
    const jsonString = JSON.stringify(data, (key, value) => {
        //custom serialization for dates
        if (value instanceof Date) {
            return value.toISOString();
        }
        // custom serialization for regular expressions
        if (value instanceof RegExp) {
            return {
                '__regex__': true,
                'source': value.source,
                'flags': value.flags,
            };
        }
        return value;
    });
    return jsonString;
}

module.exports = {
    parse,
    JSONParseError,
    stringify,
};