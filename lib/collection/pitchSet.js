'use strict'

var pitchClass = require('../pitch/pitchClass')
var toArray = require('../collection/toArray')

/**
 * Create a set of pitch classes (ordered by frequency) from a collection
 *
 * The pitch classes are ordered by frequency starting from the first note
 * of the given collection
 *
 * @param {Array|String} pitches - the collection of pitches
 * @param {String} first - (Optional) the first pitch class of the set (or the
 * first pitch class of the collection if not given)
 * @return {Array} a pitch set
 *
 * @example
 * pitchSet('D E G G A E') // => ['D', 'E', 'G', 'A']
 * pitchSet('D3 Db3 C3 D3') // => ['D', 'Db', 'C']
 * pitchSet('D3 Db3 C3 D3', 'C') // => ['C', 'Db', 'Db', 'C']
 */
function pitchSet (pitches, first) {
  pitches = toArray(pitches)
  if (arguments.length === 1) return pitchSet(pitches, pitches[0])

  first = pitchClass(first)
  var pitchClasses = pitches.map(pitchClass)
  var sorted = pitchClasses.sort()
  var uniq = sorted.filter(function (p, i) { return p && i === 0 || sorted[i] !== sorted[i - 1] })
  var index = uniq.indexOf(first)
  return uniq.slice(index).concat(uniq.slice(0, index))
}

module.exports = pitchSet
