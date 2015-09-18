'use strict'

var BINARY = /^1[01]{0,11}$/
var INTERVALS = ['1P', '2m', '2M', '3m', '3M', '4P', '4A', '5P', '6m', '6M', '7m', '7M']

/**
 * Convert a binary set number to an intervals collection
 *
 * @param {String|Integer} binary - an interval list in any of its valid forms
 * @return {Array} An array of intervals
 *
 * @example
 * intervals('1P 2M') // => ['1P', '2M']
 * intervals(2773) // => ['1P', '2M', '3M']
 */
function fromBinary (binary) {
  if (!binary) return null
  binary = binary.toString(2)
  if (!BINARY.test(binary)) return null
  var result = []
  for (var i = 0, len = binary.length; i < len; i++) {
    if (binary[i] === '1') result.push(INTERVALS[i])
  }
  return result
}

module.exports = fromBinary
