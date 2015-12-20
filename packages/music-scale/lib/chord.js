'use strict'

var build = require('./build')
var type = require('chord-type')
var G = require('music-gamut')

/**
 * Get the (triad) chord name of a scale
 *
 * @name scale.chord
 * @function
 * @param {Array|String} scale - the scale notes
 * @return {String} the chord name
 *
 * @example
 * scale.chords('c d e f g a b') // => 'CM'
 */
module.exports = function (notes) {
  var chord = G.select('1 3 5 7', build(notes, null))
  var t = type(chord)
  return t ? chord[0] + t : null
}
