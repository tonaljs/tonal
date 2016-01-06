'use strict'

var memoize = require('../memoize')
var R = require('./regex')
var fromProps = require('../array/from-props')
var alt = require('../accidentals/parse')

/**
 * Get a pitch in [array notation]()
 * from a string in [helmholtz pitch notation](https://en.wikipedia.org/wiki/Helmholtz_pitch_notation)
 *
 * This function is cached for better performance.
 *
 * @name helmholtz.parse
 * @function
 * @param {String} str - the string to parse
 * @return {Array} the note in array notation or null if not valid note
 *
 * @example
 * var parse = require('music-notation/helmholtz/parse')
 */
module.exports = memoize(function (str) {
  var m = R.exec(str)
  var letter = m[2].toUpperCase()
  var isUpper = letter === m[2]
  var step = letter.charCodeAt(0) - 67
  var oct = 2
  var dur = m[5] ? +(m[5].substring(1)) : null
  if (m[1]) { // octave prefix
    if (!isUpper) return null
    oct = 2 - m[1].length
  } else if (m[4]) { // octave postfix
    if (m[4][0] === "'" && !isUpper) oct = 3 + m[4].length
    else if (m[4][0] === ',' && isUpper) oct = 2 - m[4].length
    else return null
  } else {
    oct = isUpper ? 2 : 3
  }
  return fromProps(step, alt(m[3], false), oct, dur)
})
