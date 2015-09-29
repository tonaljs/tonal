'use strict'

var isValid = require('./isValid')

/**
 * Get a binary scale (a 12 digit binary number) from a number.
 *
 * @param {String|Integer} number - the binary scale number
 * @return {String} a binary scale (12 digit binary number)
 *
 * @example
 * fromNumber(0) // => '10000000000'
 * fromNumber(2773) // => '101011010101' (major scale)
 */
function fromNumber (source) {
  if (source !== 0 && !source) return null
  if (isValid(source)) return source
  else if (/^\d+$/.test(source)) {
    return ((source % 2048) + 2048).toString(2)
  }
}

module.exports = fromNumber
