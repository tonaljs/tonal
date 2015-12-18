'use strict'

/**
 * Decorate coordtinate conversion functions
 *
 * It helps creating functions that convert from string to pitch in array format.
 * Basically it does two things:
 * - ensure the function only receives strings
 * - memoize the result
 *
 * @name parser
 * @function
 *
 * @example
 * var parser = require('tonal.notataion/parser')
 * var parse = parser(function (str) {
 *   // str is ALWAYS a string
 *   // the return value is memoized
 * })
 */
module.exports = function (fn) {
  var cache = {}
  return function (str) {
    if (typeof str !== 'string') return null
    return (str in cache) ? cache[str] : cache[str] = fn(str)
  }
}
