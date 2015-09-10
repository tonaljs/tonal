'use strict'

var pitch = require('../pitch/pitch')

/**
 * A pitch set is a collection of unique pitchs ordered by frequency
 *
 * @param {Array|String} notes - a group of notes
 * @return {Array} a pitch set
 *
 * @example
 * pitchSet('D3 Db3 C3 D3') // => ['C3', 'Db3', 'D3']
 */
function pitchSet (notes) {
  if (typeof notes === 'string') notes = notes.split(' ')
  if (!Array.isArray(notes)) return null

  return notes
    .map(function (name) { return pitch(name) })
    .sort(function (a, b) { return a.midi - b.midi })
    .map(function (pitch) { return pitch.name })
}

module.exports = pitchSet
