# SSE Utils
![NPM Version](https://img.shields.io/npm/v/sse-utils.svg)
![Build Status](https://github.com/wdullaer/sse-utils/workflows/sse-utils/badge.svg)
![Dependency Status](https://david-dm.org/wdullaer/sse-utils.svg)
[![Code Climate](https://codeclimate.com/github/wdullaer/sse-utils/badges/gpa.svg)](https://codeclimate.com/github/wdullaer/sse-utils)
[![Test Coverage](https://codeclimate.com/github/wdullaer/sse-utils/badges/coverage.svg)](https://codeclimate.com/github/wdullaer/sse-utils/coverage)

This is a small package that aims to be the server sent events equivalent of the JSON built-in module.
It allows you to stringify an SSE object so it can be put on the wire.
It allows you parse a stringified SSE object (you'll normally use another library to create an SSE client, but this can be helpfull for testing purposes).

This library is "done", in the sense that it is feature complete and has no known bugs. It is still maintained and bugs will be fixed. It also has no dependencies, which means that other than to fix bugs in the library code, there is no reason to make new releases.

## Installation

```bash
npm install sse-utils
```

## Examples

### Individual Messages
```javascript
let sse = require('sse-utils');

let input = {data: {foo: 'bar'}};
let sseString = sse.stringify(input);
console.log(sseString);
let output = sse.parse(sseString);
console.log(output);
```

### Multiple Messages
```javascript
let sse = require('sse-utils');

let input = [{data: {foo: 'bar'}}, {data: {bar: 'baz'}}];
let sseString = sse.stringifyAll(input);
console.log(sseString);

let output = sse.parseAll(sseString);
console.log(sseString);
```

## TODO
* Add support for asynchronous (de)serializers

## API
