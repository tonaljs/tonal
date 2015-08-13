var parse = require('./parse')
var numberToGeneric = require('./number-to-generic')

/**
 * Simplify an interval
 *
 * @param {String} interval - the interval to be simplified
 * @param {boolean} ascending - (optional) if true, the simplified interval will
 * be always ascending
 *
 * @module interval
 *
 * @example
 * simple('M9') // => 'M2'
 * simple('M-9') // => 'M-2'
 * simple('M-9', true) // => 'M2'
 */
function simple (interval, ascending) {
  var parsed = parse(interval)
  var num = parsed[2] === 8 ? 8 : numberToGeneric(parsed[2]) + 1
  var dir = (ascending || parsed[1] === 1) ? '' : '-'
  return parsed[0] + dir + num
}

module.exports = simple
