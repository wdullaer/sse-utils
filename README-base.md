# SSE Utils
[![Greenkeeper badge](https://badges.greenkeeper.io/wdullaer/sse-utils.svg)](https://greenkeeper.io/)
![NPM Version](https://img.shields.io/npm/v/sse-utils.svg)
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

## TODO
* Add support for asynchronous (de)serializers

## API
