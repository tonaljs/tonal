'use strict'

var harmonizer = require('note-harmonizer')
var dictionary = require('chord-dictionary')

/**
 * Create chords either by name or by intervals
 *
 * This function is currified
 *
 * @name chord
 * @function
 * @param {String} source - the chord name, intervals or notes
 * @param {String} tonic - the chord tonic
 * @return {Array} the chord notes
 *
 * @example
 * var chord = require('music-chord')
 * // create chord from name
 * chord('Cmaj7') // => ['C', 'E', 'G', 'B']
 * chord('maj7', 'C') // => ['C', 'E', 'G', 'B']
 *
 * @example
 * // partially applied
 * var maj7 = chord('maj7')
 * maj7('C') // => ['C', 'E', 'G', 'B']
 *
 * @example
 * // create chord from intervals
 * chord('1 3 5 7', 'C') // => ['C', 'E', 'G', 'B']
 */
function chord (source, tonic) {
  var c
  if (arguments.length === 1) {
    c = dictionary(source)
    return typeof c === 'function' ? function (t) { return chord(source, t) } : c
  }
  c = dictionary(source, tonic)
  return c.length ? c : harmonizer(source, tonic)
}

if (typeof module === 'object' && module.exports) module.exports = chord
if (typeof window !== 'undefined') window.chord = chord
