'use strict'

var pitch = require('../pitch/build')

/**
 * Parase a scale name and returns its components
 *
 * A scale name can have two components:
 * - tonic: a note specifing the tonic
 * - type: the scale type
 *
 * @param {String} scale - the scale name (with optional tonic)
 * @return {Object} the parsed scale name
 *
 * @example
 * parse('C major') // => { tonic: 'C', type: 'major' }
 */
function parse (scale) {
  var note = null
  var type = scale.trim()
  var space = type.indexOf(' ')
  if (space > 0) {
    try {
      note = pitch(scale.slice(0, space)).name
      type = type.substring(note.length).trim()
    } catch (e) {}
  }
  return { tonic: note, type: type }
}

module.exports = parse
