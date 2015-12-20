'use strict'

var memoize = require('../lib/memoize')
var R = require('./regex')
var coord = require('../lib/props-to-arr')
// roman numberals to pitch property number
var NUM = {i: 0, ii: 1, iii: 2, iv: 3, v: 4, vi: 5, vii: 6}

/**
 * Roman to coordinate: convert from [roman numerals](https://en.wikipedia.org/wiki/Roman_numeral_analysis)
 * to [array-notation]()
 *
 * @name roman.parse
 * @function
 * @param {String} str - the roman numeral string
 * @return {Array} a coord or null if not valid roman numeral literal
 *
 * @example
 * var parse = require('array-notation/roman.parse')
 * parse('V') // => [1]
 * parse('bII') // => [-5]
 */
module.exports = memoize(function (str) {
  var m = R.exec(str)
  if (!m || m[3]) return null
  var num = NUM[m[2].toLowerCase()]
  var alt = m[1].length
  if (m[1][0] === 'b') alt = -alt
  return coord([num, alt])
})
