var pitchClass = require('./pitch-class')
var octave = require('./octave')

/**
 * Get the midi number of the given note
 *
 * @param {String} note - the note
 * @return {Integer} - the midi number
 *
 * @example
 * var midi = require('tonal/note/midi')
 * midi('A4') // => 69
 */
function midi (note) {
  return pitchClass(note) + 12 * (octave(note) + 1)
}

module.exports = midi
