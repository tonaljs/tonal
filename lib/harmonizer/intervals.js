'use strict'

var isInterval = require('../interval/isInterval')
var BINARY = /^1[01]{0,11}$/

/**
 * Get an array of intervals given a string, an integer or an Array
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
function intervals (source) {
  if (!source) return null
  else if (BINARY.test(source.toString(2))) return binaryIntervals(source.toString(2))
  else if (typeof source === 'string') source = source.split(' ')
  else if (!Array.isArray(source)) return null
  return areIntervals(source) ? source : null
}

/**
 * Check if is an array of intervals
 *
 * @param {Array} array - the array to check
 * @return {Boolean} true if its an array of intervals
 */
function areIntervals (array) {
  for (var i = 0, len = array.length; i < len; i++) {
    if (!isInterval(array[i])) return false
  }
  return true
}

var CHROMA = ['P1', 'm2', 'M2', 'm3', 'M3', 'P4', 'A4', 'P5', 'm6', 'M6', 'm7', 'M7']
function binaryIntervals (binary) {
  var result = []
  for (var i = 0, len = binary.length; i < len; i++) {
    if (binary[i] === '1') result.push(CHROMA[i])
  }
  return result
}

module.exports = intervals
