'use strict'

var BINARY = /^1[01]{0,11}$/
var INTERVALS = ['1P', '2m', '2M', '3m', '3M', '4P', '4A', '5P', '6m', '6M', '7m', '7M']

/**
 * Convert a binary scale to an intervals sequence
 *
 * The source can be one of the following forms:
 * - An array of intervals (they are returned without modification)
 * - A string with a intervals separated by a space
 * - A string with a binay representation
 * - A decimal (that is converted to a binary representation)
 *
 * @param {Array|String|Integer} source - an interval list in any of its valid forms
 * @return {Array} An array of intervals
 *
 * @example
 * intervals('1P 2M') // => ['1P', '2M']
 * intervals(2773) // => ['1P', '2M', '3M']
 */
function toIntervals (source) {
  if (!source) return null
  var binary = source.toString(2)
  if (!BINARY.test(binary)) return null
  var result = []
  for (var i = 0, len = binary.length; i < len; i++) {
    if (binary[i] === '1') result.push(INTERVALS[i])
  }
  return result
}

module.exports = toIntervals
