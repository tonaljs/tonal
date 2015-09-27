'use strict'

var includes = require('../_internal/includes')
var dictionary = require('./data/dictionary')

/**
 * Given a chord, get its extensions (same chord with more notes)
 *
 * @param {String} type - the chord type
 * @param {Array} an array with all the chord types that extends the given ones
 *
 * @example
 * extensions('Maj7') // => ['M13', 'M13#11', 'M7#11', ...]
 */
function extensions (type) {
  var chord = dictionary(type)
  if (!chord) return []
  var len = chord ? chord.length : 0
  return dictionary(function (intervals) {
    if (intervals.length <= chord.length) return false
    for (var i = 0; i < len; i++) {
      if (!includes(intervals, chord[i])) return false
    }
    return true
  })
}

module.exports = extensions
