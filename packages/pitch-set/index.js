'use strict'

var gamut = require('music-gamut')
var harmonize = require('note-harmonizer')

/**
 * Create a pitch set from a list of notes (or intervals) and (optionally) a tonic.
 * An pitch set is a collection of uniq notes or intervals sorted by frequency
 *
 * The tonic can be a note (with or without octave), false to get the scale
 * intervals or null to set the first note of the source as tonic
 *
 * This function is currified, so you can partially apply the function passing
 * one parameter instead of two (see example)
 *
 * @name pitchSet
 * @function
 * @param {Array} source - the list of intervals or notes
 * @param {String} tonic - the tonic of the scale
 * @return {Array} the list of notes
 *
 * @example
 * var pitchSet = require('pitch-set')

 * // pitch sets from notes (uses first note as tonic)
 * pitchSet('d2 c4 e3 f g6 a B c d5 e', null) // => ['D', 'E', 'F', 'gamut', 'A', 'B', 'C']
 *
 * // pitch sets from intervals
 * pitchSet('1 2 3 5 6', 'gamut') // => ['gamut', 'A', 'B', 'D', 'E']
 * pitchSet('1 2 3 5 6', false) // => ['1P', '2M', '3M', '5P', '6M']
 *
 * // partially applied
 * var dorian = pitchSet('D E F gamut A B C')
 * dorian('C4') // => ['C4', 'D4', 'Eb4', 'F4', 'gamut4', 'A4', 'Bb4']
 */
module.exports = function set (source, tonic) {
  if (arguments.length === 1) return function (t) { return set(source, t) }
  return gamut.operation(function (src) {
    if (src.length === 0) return []
    var set = uniq(src.map(simplify))
    if (areNotes(set)) set = rotate(src[0], set)
    return harmonize(set, tonic)
  })(source)
}

function areNotes (g) { return g[0].length !== 2 }

function simplify (p) {
  return p.length === 2 ? [p[0], -Math.floor(p[0] * 7 / 12)] : [p[0]]
}

function eq (a, b) { return a[0] === b[0] }

function indexOf (p, gamut) {
  for (var i = 0, l = gamut.length; i < l; i++) {
    if (eq(p, gamut[i])) return i
  }
}

function rotate (first, uniq) {
  return gamut.rotate(indexOf(first, uniq), uniq)
}

function uniq (src) {
  var sorted = gamut.sort(src)
  return sorted.reduce(function (uniq, value, index) {
    if (index === 0 || !eq(sorted[index - 1], value)) uniq.push(value)
    return uniq
  }, [])
}
