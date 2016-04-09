'use strict'

var parse = require('music-notation/interval/parse')
var str = require('music-notation/interval/str')
var op = require('music-notation/operation')
function isOct (i) { return Math.abs(i[0]) % 7 === 0 }
function size (i) { return i[0] * 7 + i[1] * 12 }

/**
 * Get the simplified version of an interval.
 *
 * @name interval.simplify
 * @param {String|Array} interval - the interval to simplify
 * @return {String|Array} the simplified interval
 *
 * @example
 * var simplify = require('interval-simplify')
 * simplify('9M') // => '2M'
 * ['8P', '9M', '10M', '11P', '12P', '13M', '14M', '15P'].map(simplify)
 * // => [ '8P', '2M', '3M', '4P', '5P', '6M', '7M', '8P' ]
 * simplify('2M') // => '2M'
 * simplify('-2M') // => '7m'
 */
module.exports = op(parse, str, function (i) {
  if (!Array.isArray(i)) return null
  var simple = [i[0], -Math.floor(i[0] * 7 / 12)]
  // special treatment for octaves (since 8 is a simple interval)
  if (isOct(i)) {
    var sz = size(i)
    // if less than 8ddddd don't simplify
    if (sz < 19 && sz > -6) return i
    // if interval quality is P or A or AA or AAA should add an onctave
    if (sz % 12 < 6) simple[1]++
    return simple
  }
  return simple
})
