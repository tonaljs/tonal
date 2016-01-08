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
module.exports = function scale (source, tonic) {
  var s
  if (arguments.length === 1) {
    s = dictionary(source)
    return typeof s === 'function' ? function (t) { return scale(source, t) } : s
  }
  s = dictionary(source, tonic)
  return s.length ? s : set(source, tonic)
}
