'use strict'

var isInterval = require('../interval/isInterval')
var transpose = require('../pitch/transpose')

/**
 * Create an harmonizer: a function that returns an array of notes
 * from a note
 *
 * @param {Array|String|Integer} intervals - the intervals to use
 * @return {Function} the harmonizer function
 */
function harmonizer (source) {
  var intervals = toIntervals(source)
  if (!intervals) return null

  return function (tonic) {
    return intervals.map(transpose(tonic))
  }
}

var BINARY = /^1[01]{11}$/
function toIntervals (source) {
  if (!source) return null
  else if (BINARY.test(source.toString(2))) return binaryIntervals(source.toString(2))
  else if (typeof source === 'string') source = source.split(' ')
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

module.exports = harmonizer
