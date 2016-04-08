'use strict'

var midi = require('note-midi')
var mfreq = require('midi-freq')

/**
 * Get the pitch frequency in herzs (with custom concert tuning) from a note
 * name or a midi number
 *
 * This function is currified so it can be partially applied (see examples)
 *
 * @name note.freq
 * @function
 * @param {Float} tuning - the frequency of A4 (null means 440)
 * @param {String|Integer} note - the note name or the midi number
 * @return {Float} the frequency of the note
 *
 * @example
 * var freq = require('note-freq')
 * freq(440, 'A3') // => 220
 * freq(444, 'A2') // => 111
 * // it works with midi too:
 * freq(null, 57) // => 220
 *
 * @example
 * // partially applied
 * var freq = require('note-freq')(440)
 * freq('a4') // => 440
 */
module.exports = function freq (tuning, note) {
  if (arguments.length === 1) return function (n) { return freq(tuning, n) }
  var m = midi(note)
  return mfreq(tuning, m)
}
