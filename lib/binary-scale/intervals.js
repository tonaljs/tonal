'use strict'

var isBinaryScale = require('./isBinaryScale')
var INTERVALS = ['1P', '2m', '2M', '3m', '3M', '4P', '4A', '5P', '6m', '6M', '7m', '7M']

/**
 * Get a intervals collection from a binary scale number
 *
 * @param {String} binary - a binary scale number
 * @return {Array} An array of intervals
 *
 * @example
 * intervals('1P 2M') // => ['1P', '2M']
 * intervals(2773) // => ['1P', '2M', '3M']
 */
function fromBinary (binary) {
  if (!isBinaryScale(binary)) return null
  var result = []
  for (var i = 0, len = binary.length; i < len; i++) {
    if (binary[i] === '1') result.push(INTERVALS[i])
  }
  return result
}

module.exports = fromBinary
