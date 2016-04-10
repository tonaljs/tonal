'use strict'

var gamut = require('music-gamut')
var sort = require('pitch-sort')

/**
 * Create a pitch set from a list of notes or intervals.
 * An pitch set is a collection of uniq notes or intervals sorted by frequency
 *
 * If it's pitch set of pitch classes, the first note will be the first pitch
 * class of the set.
 *
 * If it's a pitch set of intervals, the intervals are simplified and returned
 * in ascending size order
 *
 * @name pitchSet
 * @function
 * @param {Array} source - the list of intervals or notes
 * @return {Array} the list of notes
 *
 * @example
 * var pitchSet = require('pitch-set')

 * // pitch sets from notes (uses first note as tonic)
 * pitchSet('d2 c4 e3 f g6 a B c d5 e') // => ['D', 'E', 'F', 'G', 'A', 'B', 'C']
 * // simplified intervals ordered by size
 * pitchSet('1 2 3 8 9 10 11') // => [ '1P', '2M', '3M', '4P' ]
 * pitchSet('11 10 9') //=> [ '2M', '3M', '4P' ]
 */
module.exports = function set (source) {
  return gamut.transform(function (src) {
    if (src.length === 0) return []
    var set = uniq(src.map(simplify))
    if (areNotes(set)) set = rotate(src[0], set)
    return set
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
  var sorted = sort(true, src)
  return sorted.reduce(function (uniq, value, index) {
    if (index === 0 || !eq(sorted[index - 1], value)) uniq.push(value)
    return uniq
  }, [])
}
