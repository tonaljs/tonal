var parse = require('./parse')
var numberToGeneric = require('./number-to-generic')
/**
 * Convert a [diatonic interval](https://en.wikipedia.org/wiki/Interval_(music))
 * into a [generic interval](https://en.wikipedia.org/wiki/Generic_interval)
 *
 * @param {String} interval - the diatonic interval
 * @return {Integer} the generic interval
 *
 * @see genericToDiatonic
 * @module interval
 *
 * @example
 * generic('M9') // => 1
 */
function generic (interval) {
  return numberToGeneric(parse(interval).num)
}

module.exports = generic
