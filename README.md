# SSE Utils
[![Build Status](https://travis-ci.org/wdullaer/sse-utils.svg?branch=master)](https://travis-ci.org/wdullaer/sse-utils)
![Dependency Status](https://david-dm.org/wdullaer/sse-utils.svg)
[![Code Climate](https://codeclimate.com/github/wdullaer/sse-utils/badges/gpa.svg)](https://codeclimate.com/github/wdullaer/sse-utils)
[![Test Coverage](https://codeclimate.com/github/wdullaer/sse-utils/badges/coverage.svg)](https://codeclimate.com/github/wdullaer/sse-utils/coverage)

This is a small package that aims to be the server sent events equivalent of the JSON built-in module.
It allows you to stringify an SSE object so it can be put on the wire.
It allows you parse a stringified SSE object (you'll normally use another library to create an SSE client, but this can be helpfull for testing purposes).

## Installation

```bash
npm install sse-utils
```

## Example

```javascript
let sse = require('sse-utils');

let input = {foo: 'bar'};
let sseString = sse.stringify(input);
console.log(sseString);
let output = sse.parse(input);
console.log(output);
```

## API

### sse.stringify(payload, serializer)
Converts an object to an SSE compatible string

* @param payload {object}    
*data* {object} Object to be put in the data field. Uses some heuristics to properly seriaze this (`Buffer.toString('base64')`, `JSON.stringify`)  
*id* {string?} The id of this message  
*event* {string?} The event-type of this message  
Additional attributes are omitted

* @param serializer {function?} If the built-in serializers don't work for your data, you can pass in a custom one

### sse.parse(message, deserializer)
Converts a string into an SSE object

* @param message {string}
* @param deserializer {function?} If the built-in deserializer does not work for your data, you can pass your own
* @return {object} The SSE object  
*id* {string?} The id of this message  
*event* {string?} The event-type of this message  
*data* {string | object} The deserialized data  
Additional attributes are added as strings on the object

## TODO
* Add support for asynchronous (de)serializers
