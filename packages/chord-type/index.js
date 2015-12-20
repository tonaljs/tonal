'use strict'

var G = require('music-gamut')

/**
 * Get the type of the chord (can be 'M', 'm', '7' or 'o' to represent major,
 * minot, dominant and dimished respectively)
 *
 * It assumes that the chord is not inversed (first note is always the tonic)
 *
 * It detects major, minor, augmented, diminished and dominant chords. All
 * chord notes beyond the 5th (except 7th for dominant chords) are ignored
 *
 * @name chord.type
 * @function
 * @param {Array} chord - the chord notes
 * @return {String} the chord type ('M', 'm', '7', 'dim', 'aug' or null)
 *
 * @example
 * var chord = require('music.chord')
 * chord.type('C E G') // => 'M'
 * chord.type('C Eb G') // => 'm'
 * chord.type('C Eb Gb') // => 'dim'
 * chord.type('C E G#') // => 'aug'
 * chord.type('C E G B') // => 'M'
 * chord.type('C E G B7') // => '7'
 */
module.exports = function (chord) {
  var g = G.harmonizer(chord, false)
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
