let {expect} = require('chai')

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
