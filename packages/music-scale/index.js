'use strict'

var set = require('pitch-set')
var dictionary = require('scale-dictionary')

/**
 * Create a scale from a name or intervals and tonic
 *
 * @name scale
 * @function
 * @param {Array} source - the scale name, scale intervals or scale notes
 * @param {String} tonic - the tonic of the scale
 * @return {Array} the list of notes
 *
 * @example
 * var scale = require('music-scale')
 */
function scale (source, tonic) {
  var s
  if (arguments.length === 1) {
    s = dictionary(source)
    return typeof s === 'function' ? function (t) { return scale(source, t) } : s
  }
  s = dictionary(source, tonic)
  return s.length ? s : set(source, tonic)
}

/**
 * Get available scale names
 * @name scale.names
 * @function
 * @param {Boolean} aliases - if true, it returns the name aliases
 * @return {Array} the available scale names
 */
scale.names = dictionary.names

/**
 * Get scale properties
 *
 * @name scale.props
 * @function
 * @param {String} name - the scale name
 * @return {Object} the scale properties
 */
scale.props = dictionary.props

module.exports = scale
