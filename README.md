# JSON Parser and Validator

[![Build Status](https://travis-ci.org/Faiaz98/JSON-Parser.svg?branch=main)](https://travis-ci.org/Faiaz98/JSON-Parser)

This is a JavaScript library that provides tools for parsing, validating, and manipulating JSON data. It offers features like custom validation, JSON schema support, and query capabilities.

## Features

1. **JSON Parsing**: Parse JSON strings into JavaScript objects or arrays.

2. **Custom JSON Validation**: Define custom validation functions to enforce specific rules on your JSON data.

3. **JSON Schema Support**: Validate JSON data against JSON schemas for structured and schema-based data validation.

4. **Stringification**: Convert JavaScript objects and arrays back into JSON strings.

5. **Date and RegExp Serialization**: Support for serializing and deserializing Date objects and regular expressions.

## Installation

You can install this library using npm:

```bash
npm install jsonpv

## Usage

Here's how to get started with JSON Parser and Validator:

```javascript
const { parse, stringify, validateWithSchema, JSONParseError, JSONValidationError } = require('json-parser-validator');

// Parse JSON data
const jsonData = parse(jsonString);

// Serialize data
const jsonString = stringify(jsonData);

// Validate JSON data with a schema
try {
  validateWithSchema(schema, jsonData);
} catch (error) {
  if (error instanceof JSONValidationError) {
    console.error('Validation Error:', error.message);
  } else {
    console.error('Unexpected Error:', error.message);
  }
}
```