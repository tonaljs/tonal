'use strict'

var parse = require('music-notation/pitch/parse')
var gamut = require('music-gamut')
var distanceTo = require('note-interval')
var transpose = require('note-transpose')

/**
 * Create a chord (or an harmonizer-like structure) from a list or notes or
 * intervals and (optionally) a tonic. A chord is a list of notes or
 * intervals in asceding pitch order
 *
 * The tonic must be
 * a pitch (with or without octave) or false to get the intervals
 *
 * This function is currified, so you can partially apply the function passing
 * one parameter instead of two (see example)
 *
 * @name chord
 * @param {Array} source - the list of intervals or notes
 * @param {String} tonic - the tonic of the chord or null to get the intervals
 * @return {Array} the chord notes or intervals
 *
 * @example
 * var chord = require('music-chord')
 * chord('1 3 5 6', 'G') // => ['G', 'B', 'D', 'E']
 * chord('G B D E', false) // => ['1P', '3M', '5P', '6M']
 * // partially applied:
 * var maj79 = chord.build('C E G B D')
 * maj79('A4') // => ['A4', 'C#5', 'E5', 'G#5', 'B5']
 */
function chord (source, tonic) {
  if (arguments.length === 1) return function (t) { return chord(source, t) }
  return gamut.operation(function (g) {
    var base = g[0]
    var intervals = g.map(distanceTo(base))
    if (tonic === false) return intervals
    tonic = parse(tonic)
    return intervals.map(transpose(tonic))
  })(source)
}

if (typeof module === 'object' && module.exports) module.exports = chord
if (typeof window !== 'undefined') window.chord = chord
