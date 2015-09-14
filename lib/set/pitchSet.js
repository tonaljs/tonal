'use strict'

var pitchClass = require('../pitch/pitchClass')
var toArray = require('../internal/toArray')

/**
 * Create a pitch class set from a collection of pitches. The pitch classes
 * are ordered by frequency starting from the first note of the collection
 *
 * @param {Array|String} pitches - the collection of pitches
 * @return {Array} a pitch set
 *
 * @example
 * pitchSet('D E G G A E') // => ['D', 'E', 'G', 'A']
 * pitchSet('D3 Db3 C3 D3') // => ['D', 'Db', 'C']
 */
function pitchSet (pitches) {
  var pitchClasses = toArray(pitches).map(pitchClass)
  var first = pitchClasses[0]
  var sorted = pitchClasses.sort()
  var uniq = sorted.filter(function (p, i) { return p && i === 0 || sorted[i] !== sorted[i - 1] })
  var index = uniq.indexOf(first)
  return uniq.slice(index).concat(uniq.slice(0, index))
}

module.exports = pitchSet
