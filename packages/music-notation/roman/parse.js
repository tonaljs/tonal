'use strict'

var memoize = require('../memoize')
var R = require('./regex')
var toArray = require('../array/from-props')
// roman numberals to pitch property number
var NUM = {i: 0, ii: 1, iii: 2, iv: 3, v: 4, vi: 5, vii: 6}

/**
 * Roman to coordinate: convert from [roman numerals](https://en.wikipedia.org/wiki/Roman_numeral_analysis)
 * to [music-notation]()
 *
 * @name roman.parse
 * @function
 * @param {String} str - the roman numeral string
 * @return {Array} the roman number in array notation or null if not valid numeral
 *
 * @example
 * var parse = require('music-notation/roman.parse')
 * parse('V') // => [1]
 * parse('bII') // => [-5]
 */
module.exports = memoize(function (str) {
  var m = R.exec(str)
  if (!m || m[3]) return null
  var num = NUM[m[2].toLowerCase()]
  var alt = m[1].length
  if (m[1][0] === 'b') alt = -alt
  return toArray(num, alt)
})
