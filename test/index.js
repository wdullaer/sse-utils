'use strict'

let expect = require('chai').expect

let sse = require('../lib')

describe('stringify()', () => {
  it('should stringify a string', () => {
    const input = 'my-data'
    const output = sse.stringify({data: input})
    expect(output).to.be.a('string').that.equals(`data: ${input}\n\n`)
  })

  it('should stringify a string with newlines as multiple data lines', () => {
    const input = 'my-data\nmy-other-data'
    const output = sse.stringify({data: input})
    expect(output).to.be.a('string').that.equals('data: my-data\ndata: my-other-data\n\n')
  })

  it('should stringify a Buffer', () => {
    const input = new Buffer('my-data')
    const output = sse.stringify({data: input})
    expect(output).to.be.a('string').that.equals(`data: ${input.toString('base64')}\n\n`)
  })

  it('should stringify an object', () => {
    const input = {foo: 'bar'}
    const output = sse.stringify({data: input})
    expect(output).to.be.a('string').that.equals(`data: ${JSON.stringify(input)}\n\n`)
  })

  it('should stringify a number', () => {
    const input = 2
    const output = sse.stringify({data: input})
    expect(output).to.be.a('string').that.equals('data: 2\n\n')
  })

  it('should set the correct event type', () => {
    const input = 'my-data'
    const eventType = 'my-event'
    const output = sse.stringify({event: eventType, data: input})
    expect(output).to.be.a('string').that.equals(`event: ${eventType}\ndata: ${input}\n\n`)
  })

  it('should set the correct id', () => {
    const input = 'my-data'
    const id = 'my-id'
    const output = sse.stringify({id, data: input})
    expect(output).to.be.a('string').that.equals(`id: ${id}\ndata: ${input}\n\n`)
  })

  it('should set all attributes', () => {
    const input = 'my-data'
    const eventType = 'my-event'
    const id = 'my-id'
    const output = sse.stringify({id, event: eventType, data: input})
    expect(output).to.be.a('string').that.equals(`event: ${eventType}\nid: ${id}\ndata: ${input}\n\n`)
  })

  it('should use the serializer function', () => {
    const input = 'my-data'
    const serializer = () => 'serialized'
    const output = sse.stringify({data: input}, serializer)
    expect(output).to.be.a('string').that.equals('data: serialized\n\n')
  })

  it('should throw an error when data is not present', () => {
    const stringify = sse.stringify.bind(null, {foo: 'bar'})
    expect(stringify).to.throw(TypeError)
  })

  it('should throw an error when id is not a string', () => {
    const id = {foo: 'bar'}
    const stringify = sse.stringify.bind(null, {data: 'my-data', id})
    expect(stringify).to.throw(TypeError)
  })

  it('should throw an error when event is not a string', () => {
    const event = {foo: 'bar'}
    const stringify = sse.stringify.bind(null, {data: 'my-data', event})
    expect(stringify).to.throw(TypeError)
  })

  it('should throw an error when the serializer does not return a string', () => {
    const serializer = () => ({foo: 'bar'})
    const stringify = sse.stringify.bind(null, {data: 'my-data'}, serializer)
    expect(stringify).to.throw(TypeError)
  })
})

describe('stringifyAll()', () => {
  it('should stringify an array of data', () => {
    const input = 'my-data'
    const output = sse.stringifyAll([{data: input}])
    expect(output).to.be.a('string').that.equals(`data: ${input}\n\n`)
  })

  it('should stringify an array with multiple data items', () => {
    const input = [{data: 'my-data'}, {data: 'my-other-data'}]
    const expected = 'data: my-data\n\ndata: my-other-data\n\n'
    const output = sse.stringifyAll(input)
    expect(output).to.be.a('string').that.equals(expected)
  })

  it('should use the serializer function', () => {
    const input = 'my-data'
    const serializer = () => 'serialized'
    const output = sse.stringifyAll([{data: input}], serializer)
    expect(output).to.be.a('string').that.equals('data: serialized\n\n')
  })

  it('should throw an error when the input is not an array', () => {
    const input = 'foo'
    const stringifyAll = sse.stringifyAll.bind(null, input)
    expect(stringifyAll).to.throw(TypeError)
  })

  it('should throw an error if a object in the input does not pass sanitization', () => {
    const input = [{foo: 'bar'}]
    const stringifyAll = sse.stringifyAll.bind(null, input)
    expect(stringifyAll).to.throw(TypeError)
  })

  it('should throw an error if the serializer does not return a string', () => {
    const serializer = () => ({foo: 'bar'})
    const stringifyAll = sse.stringifyAll.bind(null, [{data: 'my-data'}], serializer)
    expect(stringifyAll).to.throw(TypeError)
  })
})

describe('parse()', () => {
  it('should parse string data', () => {
    const data = 'my-data'
    const input = sse.stringify({data})
    const output = sse.parse(input)
    expect(output).to.be.an('object').that.deep.equals({data})
  })

  it('should parse multiple data lines', () => {
    const data = 'my-data\nmy-other-data'
    const input = sse.stringify({data})
    const output = sse.parse(input)
    expect(output).to.be.an('object').that.deep.equals({data})
  })

  it('should parse JSON data', () => {
    const data = {foo: 'bar'}
    const input = sse.stringify({data})
    const output = sse.parse(input)
    expect(output).to.be.an('object').that.has.property('data').which.deep.equals(data)
  })

  it('should parse JSON data that has newlines in the values', () => {
    const data = {foo: 'bar\nbaz'}
    const input = sse.stringify({data})
    const output = sse.parse(input)
    expect(output).to.be.an('object').that.has.property('data').which.deep.equals(data)
  })

  it('should parse using a deserializer function', () => {
    const data = new Buffer('my-data')
    const input = sse.stringify({data})
    const output = sse.parse(input, (payload) => new Buffer(payload, 'base64').toString('utf-8'))
    expect(output).to.be.an('object').that.has.property('data', 'my-data')
  })

  it('should return an empty object when passed undefined', () => {
    const output = sse.parse()
    expect(output).to.be.an('object').that.deep.equals({})
  })

  it('should return an empty object when passed an sse comment', () => {
    const input = ':\n\n'
    const output = sse.parse(input)
    expect(output).to.be.an('object').that.deep.equals({})
  })

  it('should throw an error when the input is not a string', () => {
    const parse = sse.parse.bind(null, {foo: 'bar'})
    expect(parse).to.throw(TypeError)
  })

  it('should throw an error if the input does not end with 2 newlines', () => {
    const parse = sse.parse.bind(null, 'my-data')
    expect(parse).to.throw(TypeError)
  })
})

describe('parseAll()', () => {
  it('should parse string data to an array of objects', () => {
    const data = 'my-data'
    const input = sse.stringify({data})
    const output = sse.parseAll(input)
    expect(output).to.be.an('array').that.deep.equals([{data}])
  })

  it('should parse multiple items into an array', () => {
    const data = ['my-data', 'my-other-data']
    const input = sse.stringifyAll(data.map(str => ({data: str})))
    const output = sse.parseAll(input)
    expect(output).to.be.an('array').that.deep.equals(data.map(str => ({data: str})))
  })

  it('should parse multiple items containing an sse comment into an array', () => {
    const input = 'data: my-data\n\n:some-other-data\n\ndata: my-other-data\n\n'
    const expected = [{data: 'my-data'}, {}, {data: 'my-other-data'}]
    const output = sse.parseAll(input)
    expect(output).to.be.an('array').that.deep.equals(expected)
  })

  it('should parse multiple items if the trailing double newlines are missing', () => {
    const input = 'data: my-data\n\ndata: my-other-data'
    const expected = [{data: 'my-data'}, {data: 'my-other-data'}]
    const output = sse.parseAll(input)
    expect(output).to.be.an('array').that.deep.equals(expected)
  })

  it('should parse using a deserializer function', () => {
    const data = new Buffer('my-data')
    const expected = [{data: 'my-data'}]
    const input = sse.stringify({data})
    const output = sse.parseAll(input, (payload) => new Buffer(payload, 'base64').toString('utf-8'))
    expect(output).to.be.an('array').that.deep.equals(expected)
  })

  it('should return an empty array if the input is the empty string', () => {
    const input = ''
    const expected = []
    const output = sse.parseAll(input)
    expect(output).to.deep.equal(expected)
  })

  it('should return an empty array if the input is undefined', () => {
    const input = undefined
    const expected = []
    const output = sse.parseAll(input)
    expect(output).to.deep.equal(expected)
  })

  it('should throw an error if the input is not a string', () => {
    const input = {foo: 'bar'}
    const parseAll = sse.parseAll.bind(null, input)
    expect(parseAll).to.throw(TypeError)
  })
})
