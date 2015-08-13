var REGEX = /^([AdmMP])(-?)(\d+)$/

/**
 * Parse a interval
 *
 * @param {String} name - the name of the interval to be parsed
 * @return {Array} an array in the form [quality, direction, number]
 *
 * @api private
 * @example
 * var parse = require('tonal/interval/parse')
 * parse('P-5') // => ['P', -1, 5]
 * parse('M9') // => ['M', 1, 9]
 */
function parse (interval) {
  var m = REGEX.exec(interval)
  if (!m) throw Error('Not an interval: ' + interval)
  return [m[1], m[2] === '' ? 1 : -1, +m[3]]
}

module.exports = parse
