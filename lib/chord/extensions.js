'use strict'

var includes = require('../_internal/includes')
var chords = require('./data/chords')

/**
 * Given a chord type, get its extensions (same chord with more notes)
 *
 * @param {String} type - the chord type
 * @return {Array} an array with all the chord types that extends the given ones
 *
 * @example
 * extensions('Maj7') // => ['M13', 'M13#11', 'M7#11', ...]
 */
function extensions (type) {
  var chord = chords(type)
  if (!chord) return []
  var len = chord ? chord.length : 0
  return chords(function (intervals) {
    if (intervals.length <= chord.length) return false
    for (var i = 0; i < len; i++) {
      if (!includes(intervals, chord[i])) return false
    }
    return true
  })
}

module.exports = extensions
