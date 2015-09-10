'use strict'

var pitch = require('../pitch/pitch')

/**
 * A pitch set is a collection of unique pitch classes ordered by frequency
 *
 * @param {Array|String} notes - a group of notes
 * @return {Array} a pitch set
 *
 * @example
 * pitchSet('D3 Db3 C3 D3') // => ['C3', 'Db3', 'D3']
 */
function pitchSet (notes, pitchClasses) {
  if (typeof notes === 'string') notes = notes.split(' ')
  if (!Array.isArray(notes)) return null

  // pitches ordered by frequency
  var pitches = notes
    .map(function (name) { return pitchClasses ? pitch(name, 4) : pitch(name) })
    .sort(function (a, b) { return a.midi - b.midi })

  // remove duplicates
  return pitches.filter(function (p, i) { return i === 0 || p.pitchClass !== pitches[i - 1].pitchClass })
    .map(function (pitch) { return pitchClasses ? pitch.pitchClass : pitch.name })
}

module.exports = pitchSet
