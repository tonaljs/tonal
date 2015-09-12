'use strict'

var pitch = require('../pitch/pitch')
var sequence = require('../sequence/sequence')

/**
 * A pitch set is a sequence of unique pitch classes ordered by frequency
 *
 * This method will order the pitch classes by frequency, but starting always
 * with the first pitch class of the original sequence
 *
 * @param {Array|String} pitches - a group of pitches
 * @return {Array} a pitch set
 *
 * @example
 * pitchSet('D E G G A E') // => ['D', 'E', 'G', 'A']
 * pitchSet('D3 Db3 C3 D3') // => ['D', 'Db', 'C']
 */
function pitchSet (pitches) {
  pitches = sequence(pitches, pitch)
  if (!pitches) return null
  var pcs = pitches.map(by('pitchClass')).sort()
  var uniq = pcs.filter(function (p, i) { return i === 0 || pcs[i] !== pcs[i - 1] })
  var index = uniq.indexOf(pitches[0].pitchClass)
  return uniq.slice(index).concat(uniq.slice(0, index))
}

function by (name) {
  return function (i) { return i[name] }
}

module.exports = pitchSet
