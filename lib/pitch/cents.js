'use strict'

var freq = require('./toFreq')

/**
 * Get the distance in cents between pitches or frequencies
 *
 * @param {String|Integer} from - first pitch or frequency
 * @param {String|Integer} to - other pitch or frequency
 * @param {Integer} decimals - the decimal precision (2 by default)
 * @return {Integer} the distance in cents
 *
 * @example
 * cents(440, 444) // => 15.66
 * cents('A4', 444) // => 15.66
 * cents('A4', 'A#4') // => 100
 */
function cents (from, to, decimals) {
  var dec = decimals ? Math.pow(10, decimals) : 100
  from = freq(from)
  to = freq(to)
  return Math.floor(1200 * (Math.log(to / from) * dec / Math.log(2))) / dec
}

module.exports = cents
