var REGEX = /^([AdmMP])(-?)(\d+)$/

/**
 * Get the interval components
 *
 * This method retuns an object with the following properties:
 * - q: the quality (one of `dmPMA` for dimished, minor, perfect, major and
 * augmented respectively)
 * - d: direction, 1 for ascending intervals, -1 for descending ones
 * - n: diatonic number (a positive integer bigger that 0)
 *
 * @param {String} name - the name of the interval to be parsed
 * @return {Array} an array in the form [quality, direction, number]
 *
 * @example
 * var parse = require('tonal/interval/parse')
 * parse('P-5') // => {q: 'P', d: -1, n: 5}
 * parse('M9') // => {q: 'M', d: 1, n: 9}
 */
function parse (interval) {
  var m = REGEX.exec(interval)
  if (!m) throw Error('Not an interval: ' + interval)
  return { q: m[1], d: m[2] === '' ? 1 : -1, n: +m[3] }
}

module.exports = parse
