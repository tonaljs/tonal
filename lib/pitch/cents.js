'use strict'

var freq = require('./freq')

/**
 * Return the distance in cents between to pitches or frequencies with two
 * decimals precision
 *
 * @param {String|Integer} from - first pitch or frequency
 * @param {String|Integer} to - other pitch or frequency
 * @return {Integer} the distance in cents
 *
 * @example
 * cents(440, 444) // => 15.66
 * cents('A4', 444) // => 15.66
 * cents('A4', 'A#4') // => 100
 */
function cents (from, to) {
  from = freq(from)
  to = freq(to)
  return Math.floor(120000 * (Math.log(to / from) / Math.log(2))) / 100
}

module.exports = cents
