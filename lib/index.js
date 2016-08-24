'use strict'

/**
 * @typedef  {object}  SSEObject
 * @property {any}     data  The payload of the message
 * @property {?string} id    The ID of the message (for reconnection)
 * @property {?string} event The type of event being sent
 */

 /**
  * Custom serialization function
  * @typedef {function} Serializer
  * @param   {any} payload
  * @return  {string}
  */

/**
 * Custom deserialization function
 * @typedef {function} Deserializer
 * @param   {string} data
 * @return  {any}
 */

const JSON_INIT = ['{', '[']

if (!JSON_INIT.includes) JSON_INIT.includes = (item) => JSON_INIT.indexOf(item) !== -1

/**
 * Stringify the data to an SSE message
 * @param  {SSEObject}      payload    The payload of the sse message: contains data, id?, event?
 * @param  {?Serializer}    serializer A specialized function that marshals the data into a string (optional)
 * @return {string}                    The data as an SSE message
 * @throws {TypeError}                 Arguments should have their correct types
 */
function stringify (payload, serializer) {
  // Sanitize input
  if (!payload.data) throw new TypeError('payload should be an object that contains an attribute data')
  if (payload.event && typeof payload.event !== 'string') throw new TypeError('event attribute should be a string')
  if (payload.id && typeof payload.id !== 'string') throw new TypeError('id attribute should be a string')

  // Serialize data
  if (serializer) {
    payload.data = [serializer(payload.data)]
    if (typeof payload.data[0] !== 'string') throw new TypeError('serializer function should return a string')
  } else if (Buffer.isBuffer(payload.data)) {
    payload.data = [payload.data.toString('base64')]
  } else if (typeof payload.data === 'object') {
    payload.data = [JSON.stringify(payload.data)]
  } else if (typeof payload.data === 'string') {
    payload.data = payload.data.split('\n')
  } else {
    payload.data = [payload.data]
  }

  // Generate output string
  let output = ''
  if (payload.event) output += `event: ${payload.event}\n`
  if (payload.id) output += `id: ${payload.id}\n`
  output += payload.data.reduce((value, item) => `${value}data: ${item}\n`, '')
  output += '\n'
  return output
}

/**
 * Parse an SSE message and return the data
 * @param  {string}        sseObject    The SSE message to parse
 * @param  {?Deserializer} deserializer A specialized function to reconstruct the payload
 * @return {SSEObject}                  The data sent in this SSE message
 * @throws {TypeError}                  `sseObject` should be a string including the terminating newlines
 */
function parse (sseObject, deserializer) {
  // Sanitize the input
  if (!sseObject) return {}
  if (typeof sseObject !== 'string') throw new TypeError('sseObject should be a string ending with \\n\\n')
  if (!sseObject.endsWith('\n\n')) throw new TypeError('sseObject should be a string ending with \\n\\n')

  let attributes = sseObject.slice(0, -2).split('\n')
  let payload = attributes.reduce(
    (output, item) => {
      let tmp = item.split(':')
      let key = tmp[0].trim()
      let value = tmp.slice(1).map(trim).join(':')

      if (key === '') return output
      if (output[key]) output[key] += `\n${value}`
      else output[key] = value
      return output
    },
    {}
  )

  if (!payload.data) return payload

  if (deserializer) payload.data = deserializer(payload.data)
  else if (JSON_INIT.includes(payload.data[0])) payload.data = JSON.parse(payload.data)
  return payload
}

function trim (str) {
  return str.trim()
}

module.exports = {
  stringify,
  parse
}
