'use strict'

var props = require('../interval/props')
var list = ['P1', 'm2', 'M2', 'm3', 'M3', 'P4', 'A4', 'P5', 'm6', 'M6', 'm7', 'M7']

/**
 * Returns a interval list with a chromatic scale
 *
 * The harmonic chromatic scale is the same whether rising or falling and
 * includes all the notes in the major, harmonic minor or melodic minor
 * scales plus flattened second and sharpened fourth degrees
 *
 * @param {Integer} length - the number of items in the list
 * @return {Array} a list (of intervals or notes, depending of params)
 */
function chromaticList (length) {
  if (length > list.length) list = upToOctave(list, length % 12)
  return list.slice(0, length)
}

module.exports = chromaticList

function upToOctave (source, octave) {
  var interval, num
  var result = source.slice(0, 12)
  for (var oct = 1; oct <= octave; oct++) {
    num = oct * 8 - 1
    for (var i = 0; i < 12; i++) {
      interval = props(source[i])
      result.push(interval.quality + (interval.num + num))
    }
  }
  return result
}
