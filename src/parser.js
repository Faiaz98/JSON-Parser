const Ajv = require('ajv');
const { error } = require('ajv/dist/vocabularies/applicator/dependencies');
const ajv = new Ajv();

/**
 * Parses a JSON array of tokens into an object or array.
 * @param {Array} tokens - An array of tokens.
 * @returns {Object|Array} - The parsed JSON data.
 * @throws {Error} If the JSON is invalid.
 */
function validateWithSchema(jsonSchema, jsonData) {
    const validate = ajv.compile(jsonSchema);

    if (!validate(jsonData)) {
        const errorMessages = validate.errors.map(error => error.message);
        throw new Error(`JSON Schema validation failed: ${errorMessages.join(', ')}`);
    }

    return jsonData;
}

class JSONParseError extends Error {
    constructor(message) {
        super(message);
        this.name = 'JSONParseError';
    }
}

class JSONValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'JSONValidationError';
    }
}

function parse(tokens, customValidation = null) {
    const jsonString = tokens.join('');
    try {
        let parsedData = JSON.parse(jsonString, (key, value) => {
            if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/)) {
                return new Date(value);
            }
            // custom deserialization for regular expressions
            if (value && typeof value === 'object') {
                if (value['__regex__']) {
                    return new RegExp(value.source, value.flags);
                }

            }
            return value;
        });

        //apply custom validation
        if (customValidation && !customValidation(parsedData)) {
            throw new JSONValidationError('Custom validation failed');
        }


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
                __regex__: true,
                source: value.source,
                flags: value.flags,
            };
        }
        return value;
    });
    return jsonString;
}

/*function parseJson(jsonString, query) {
    let jsonData = JSON.parse(jsonString);

    if (query) {
        if (query.filter && typeof query.filter === 'function') {
            jsonData = jsonData.filter(query.filter);
        }

        if (query.limit) {
            jsonData = jsonData.slice(0, query.limit);
        }
    }

    return jsonData;
}*/



module.exports = {
    parse,
    JSONParseError,
    JSONValidationError,
    stringify,
    validateWithSchema,
};