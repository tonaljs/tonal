'use strict'

var harmonizer = require('note-harmonizer')

/**
 * Given a triad notes, get it's type (can be 'M', 'm', '7' or 'o' to represent major,
 * minor, dominant and diminished respectively)
 *
 * It assumes that the chord is not inverted (first note is always the tonic)
 *
 * It detects major, minor, augmented, diminished and dominant chords. All
 * chord notes beyond the 5th (except 7th for dominant chords) are ignored
 *
 * @name chordType
 * @function
 * @param {Array} chord - the chord notes
 * @return {String} the chord type ('M', 'm', '7', 'dim', 'aug' or null)
 *
 * @example
 * var type = require('chord-type')
 * type('C E G') // => 'M'
 * type('C Eb G') // => 'm'
 * type('C Eb Gb') // => 'dim'
 * type('C E G#') // => 'aug'
 * type('C E G B') // => 'M'
 * type('C E G B7') // => '7'
 */
module.exports = function (chord) {
  var g = harmonizer(chord, false)
  var steps = g.map(function (i) { return i ? i.charAt(0) : i })
  if (steps[0] !== '1' || steps[2] !== '5') return null
  if (g[1] === '3M') {
    if (g[2] === '5A') return 'aug'
    else return g[3] === '7m' ? '7' : 'M'
  } else if (g[1] === '3m') {
    return g[2] === '5P' ? 'm' : 'dim'
  } else if (g[1] === '4P') {
    return 'sus4'
  }
}
