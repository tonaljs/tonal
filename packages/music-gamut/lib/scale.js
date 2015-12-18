'use strict'

var transpose = require('note-transpose')
var operation = require('./operation')
var harmonics = require('./harmonics')
var split = require('./split')
var set = require('./set')

/**
 * Create a scale from a gamut and a tonic. A scale is a set of notes or
 * intervals ordered by frequency with a tonic.
 *
 * A source can be a list of intervals or notes.

 * The tonic can be a note (with or without octave), false to get the scale
 * intervals or null to set the first note of the source as tonic
 *
 * This function is currified, so you can partially apply the function passing
 * one parameter instead of two (see example)
 *
 * @name gamut.scale
 * @function
 * @param {Array} source - the list of intervals or notes
 * @param {String} tonic - the tonic of the scale
 * @return {Array} the list of notes
 *
 * @example
 * var scale = require('tonal.gamut/scale')
 * // basic usage
 * scale('1 2 3 5 6', 'G') // => ['G', 'A', 'B', 'D', 'E']
 * scale('1 2 3 5 6', false) // => ['1P', '2M', '3M', '5P', '6M']
 *
 * @example
 * // uses first note of the source as tonic
 * scale('c d e f g a b c d e', null) // => []
 *
 * @example
 * // partially applied
 * var dorian = scale('D E F G A B C')
 * dorian('C4') // => ['C4', 'D4', 'Eb4', 'F4', 'G4', 'A4', 'Bb4']
 */
module.exports = function b (notes, tonic) {
  if (arguments.length === 1) return function (t) { return b(notes, t) }
  notes = split(notes)
  var len = notes.length
  if (len === 0) return []
  var intervals = operation(function (gamut) {
    tonic = !tonic && tonic !== false ? gamut[0] : tonic
    var s = set(gamut)
    var i = indexOf(gamut[0][0], s, len)
    var ordered = s.slice(i, len).concat(s.slice(0, i))
    return harmonics(ordered)
  }, notes)
  tonic = !tonic && tonic !== false ? notes[0] : tonic
  return intervals.map(transpose(tonic))
}

function indexOf (p, g, l) {
  for (var i = 0; i < l; i++) {
    if (g[i][0] === p) return i
  }
}
