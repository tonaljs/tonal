'use strict'

var parse = require('music-notation/pitch/parse')
var gamut = require('music-gamut')
var distanceTo = require('note-interval')
var transpose = require('note-transposer')

/**
 * Harmonize a note using a collection of intervals or notes.
 *
 * The tonic must be
 * a pitch (with or without octave) or false to get the intervals
 *
 * This function is currified, so you can partially apply the function passing
 * one parameter instead of two (see example)
 *
 * @function harmonize
 * @param {Array} source - the list of intervals or notes
 * @param {String} tonic - the tonic of the chord or null to get the intervals
 * @return {Array} the chord notes or intervals
 *
 * @example
 * var harmonize = require('note-harmonize')
 * harmonize('1 3 5 6', 'G') // => ['G', 'B', 'D', 'E']
 * harmonize('G B D E', false) // => ['1P', '3M', '5P', '6M']
 *
 * // create harmonizers:
 * var maj79 = harmonize('1 3 5 7 9')
 * maj79('A4') // => ['A4', 'C#5', 'E5', 'G#5', 'B5']
 */
function harmonize (source, tonic) {
  if (arguments.length === 1) return function (t) { return harmonize(source, t) }
  return gamut.transform(function (g) {
    if (tonic === null) return g
    var base = g[0]
    var intervals = g.map(distanceTo(base))
    if (tonic === false) return intervals
    tonic = parse(tonic)
    return intervals.map(transpose(tonic))
  }, source)
}

if (typeof module === 'object' && module.exports) module.exports = harmonize
if (typeof window !== 'undefined') window.harmonize = harmonize
