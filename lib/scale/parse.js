'use strict'

var props = require('../pitch/props')

/**
 * Parase a scale name and returns its components
 *
 * A scale name can have two components:
 * - tonic: a pitch specifing the tonic
 * - type: the scale type
 *
 * @param {String} scale - the scale name (with optional tonic)
 * @return {Object} the parsed scale name
 *
 * @example
 * parse('C major') // => { tonic: 'C', type: 'major' }
 */
function parse (scale) {
  var pitch = null
  var type = scale.trim()
  var space = type.indexOf(' ')
  if (space > 0) {
    try {
      pitch = props(scale.slice(0, space)).sci
      type = type.substring(pitch.length).trim()
    } catch (e) {}
  }
  return { tonic: pitch, type: type }
}

module.exports = parse
