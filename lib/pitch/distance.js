'use strict'

var props = require('./props')
/**
 * Return the distance in semitones between to pitches
 *
 */
function distance (from, to) {
  from = props(from)
  to = props(to)
  if (!from || !to) return null
  return to.midi - from.midi
}

module.exports = distance
