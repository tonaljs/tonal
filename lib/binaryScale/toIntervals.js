'use strict'

var BINARY = /^1[01]{0,11}$/
var INTERVALS = ['P1', 'm2', 'M2', 'm3', 'M3', 'P4', 'A4', 'P5', 'm6', 'M6', 'm7', 'M7']

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
 * intervals('P1 M2') // => ['P1', 'M2']
 * intervals(2773) // => ['P1', 'M2', 'M3']
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
