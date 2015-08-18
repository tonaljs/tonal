var parse = require('../interval/parse')
var set = ['P1', 'm2', 'M2', 'm3', 'M3', 'P4', 'A4', 'P5', 'm6', 'M6', 'm7', 'M7']

/**
 * Returns a set of intervals that represents an harmonic chromatic scale
 *
 * The harmonic chromatic scale is the same whether rising or falling and
 * includes all the notes in the major, harmonic minor or melodic minor
 * scales plus flattened second and sharpened fourth degrees
 */
function chromaticIntervalSet (length) {
  if (length > set.length) set = upToOctave(set, length % 12)
  return set.slice(0, length)
}

module.exports = chromaticIntervalSet

function upToOctave (source, octave) {
  var interval, num
  var result = source.slice(0, 12)
  for (var oct = 1; oct <= octave; oct++) {
    num = oct * 8 - 1
    for (var i = 0; i < 12; i++) {
      interval = parse(source[i])
      result.push(interval.q + (interval.n + num))
    }
  }
  return result
}
