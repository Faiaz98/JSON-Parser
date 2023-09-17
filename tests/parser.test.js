const { parse, JSONParseError } = require('../src/parser');
const { stringify } = require('../src/parser');
const { customValidation, JSONValidationError } = require('../src/parser');
const { validateWithSchema } = require('../src/parser');
const mySchema = require('../schemas/mySchema.json');

test('Parsing a JSON object', () => {
    const tokens = ['{', '"name"', ':', '"Faiaz"', ',', '"age"', ':', '25', '}'];
    const parsedData = parse(tokens);
    expect(parsedData).toEqual({ name: 'Faiaz', age: 25 });
});

test('Parsing a JSON array', () => {
    const tokens = ['[', '1', ',', '2', ',', '3', ']'];
    const parsedData = parse(tokens);
    expect(parsedData).toEqual([1, 2, 3]);
});

test('Parsing a nested JSON object', () => {
    const tokens = ['{', '"person"', ':', '{"name": "Alice", "age": 25}', '}'];
    const parsedData = parse(tokens);
    expect(parsedData).toEqual({ person: { name: 'Alice', age: 25 } });
});

test('Parsing an empty JSON object', () => {
    const tokens = ['{', '}'];
    const parsedData = parse(tokens);
    expect(parsedData).toEqual({});
});

test('Parsing an empty JSON array', () => {
    const tokens = ['[', ']'];
    const parsedData = parse(tokens);
    expect(parsedData).toEqual([]);
});

test('Parsing invalid JSON', () => {
    const invalidTokens = ['{', '"name"', ':', '"John"', ',', '"age"', ':', '30', ']']; // Missing opening brace
    expect(() => parse(invalidTokens)).toThrow('Invalid JSON format');
});

test('Parsing JSON with nested arrays', () => {
    const tokens = ['[', '1', ',', '[2, 3]', ',', '4', ']'];
    const parsedData = parse(tokens);
    expect(parsedData).toEqual([1, [2, 3], 4]);
});

test('Parsing JSON with unexpected input', () => {
    const unexpectedTokens = ['{', '"name"', ':', '"John"', '}', 'extraToken']; // Extra token
    expect(() => parse(unexpectedTokens)).toThrow(JSONParseError);
});

test('Parsing deeply nested JSON', () => {
    const tokens = ['{', '"obj1"', ':', '{', '"obj2"', ':', '{', '"obj3"', ':', '{}', '}', '}', '}'];
    const parsedData = parse(tokens);
    expect(parsedData).toEqual({
        obj1: { obj2: { obj3: {} } }
    });
});

test('Parsing and stringifying dates', () => {
    const date = new Date('2023-09-13T12:00:00Z');
    const tokens = [JSON.stringify(date)]; //pass the date as a token
    const parsedDate = parse(tokens);
    expect(parsedDate).toEqual(date);
});

test('Parsing and stringifying regular expressions', () => {
    const regex = /pattern/g;
    const jsonString = stringify(regex);
    const parsedRegex = parse([jsonString]); // Pass the JSON string as an array
    expect(parsedRegex).toBeInstanceOf(RegExp);
    expect(parsedRegex.source).toEqual(regex.source);
    expect(parsedRegex.flags).toEqual(regex.flags);
});

test('Custom JSON Validation: Valid JSON data', () => {
    const jsonData = { age: 25 };
    const customValidation = (parsedData) => {
        if (parsedData.age >= 18) {
            return true;
        } else {
            throw new JSONValidationError('Age must be 18 or older');
        }
    };

    const jsonString = JSON.stringify(jsonData);
    const tokens = [jsonString];

    try {
        const parsedData = parse(tokens, customValidation);
        expect(parsedData).toEqual(jsonData);
    } catch (error) {
        expect(error).toBeInstanceOf(JSONValidationError);
        expect(error.message).toEqual('Age must be 18 or older');
    }
});


test('JSON Schema Validation: Valid JSON Data', () => {
    const jsonData = {
        "name": "John",
        "age": 25
    };

    // Ensure that the validation does not throw an error
    const validatedData = validateWithSchema(mySchema, jsonData);

    // Expect that the validated data is the same as the input JSON data
    expect(validatedData).toEqual(jsonData);
});

test('JSON Schema Validation: Invalid JSON Data (Age < 18)', () => {
    const jsonData = {
        "name": "Alice",
        "age": 16 // Age is below the minimum allowed (18)
    };

    // Expect that validating this data throws an error
    expect(() => validateWithSchema(mySchema, jsonData)).toThrow(Error);
});

test('JSON Schema Validation: Invalid JSON Data (Missing Required Field)', () => {
    const jsonData = {
        "name": "Bob"
            // Age is missing, which is a required field
    };

    // Expect that validating this data throws an error
    expect(() => validateWithSchema(mySchema, jsonData)).toThrow(Error);
});