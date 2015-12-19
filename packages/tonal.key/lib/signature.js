'use strict'

var alterations = require('./alterations')

/**
 * Get signature of a key
 *
 * @name key.signature
 * @function
 * @param {String} name - the key name
 * @return {String} a string with the alterations
 *
 * @example
 * key.signature('F major') // => 'b'
 * key.signature('Eb major') // => 'bbb'
 * key.signature('A major') // => '###'
 * key.signature('C major') // => ''
 * key.signature('nonsense') // => null
 */
module.exports = function (key) {
  var n = alterations(key)
  return n !== null ? new Array(Math.abs(n) + 1).join(n < 0 ? 'b' : '#') : null
}
