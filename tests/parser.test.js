const { parse, JSONParseError } = require('../src/parser');
const { stringify } = require('../src/parser');

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