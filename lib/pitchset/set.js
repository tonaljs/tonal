'use strict'

var pitch = require('../pitch/pitch')

/**
 * A pitch set is a collection of unique Pitch instances ordered by frequency
 */
function set (notes) {
  if(typeof notes === 'string') notes = notes.split(' ')
  if(!Array.isArray(notes)) return null

  return notes
    .map(function (name) { return pitch(name) })
    .sort(function(a, b) { return a.midi - b.midi })
    .map(function(pitch) { return pitch.name })
}

module.exports = set
