'use strict'

var G = require('music-gamut')
var transpose = require('note-transpose')
var distanceTo = require('note-interval')

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
 * pitchSet('d2 c4 e3 f g6 a B c d5 e', null) // => ['D', 'E', 'F', 'G', 'A', 'B', 'C']
 *
 * // pitch sets from intervals
 * pitchSet('1 2 3 5 6', 'G') // => ['G', 'A', 'B', 'D', 'E']
 * pitchSet('1 2 3 5 6', false) // => ['1P', '2M', '3M', '5P', '6M']
 *
 * // partially applied
 * var dorian = pitchSet('D E F G A B C')
 * dorian('C4') // => ['C4', 'D4', 'Eb4', 'F4', 'G4', 'A4', 'Bb4']
 */
module.exports = function set (source, tonic) {
  if (arguments.length === 1) return function (t) { return set(source, t) }
  return G(source, function (gamut) {
    var uniq = uniqPC(gamut)
    if (uniq.length === 0) return uniq
    var ordered = uniq[0].length !== 2 ? order(gamut[0], uniq) : uniq
    if (tonic === null) return ordered
    var intervals = ordered.map(distanceTo(ordered[0]))
    if (tonic === false) return intervals
    return intervals.map(transpose(tonic))
  })
}

function simplify (p) {
  return p.length === 2 ? [p[0], -Math.floor(p[0] * 7 / 12)] : [p[0]]
}
function equal (a, b) {
  return a[0] === b[0] && a[1] === b[1]
}
function indexOf (p, g, l) {
  for (var i = 0; i < l; i++) {
    if (g[i][0] === p) return i
  }
}

function order (first, uniq) {
  var len = uniq.length
  var firstNdx = indexOf(first[0], uniq, len)
  return uniq.slice(firstNdx, len).concat(uniq.slice(0, firstNdx))
}

function uniqPC (gamut) {
  var sorted = G.sort(gamut.map(simplify))
  return sorted.reduce(function (uniq, value, index) {
    if (index === 0 || !equal(sorted[index - 1], value)) uniq.push(value)
    return uniq
  }, [])
}
