'use strict';

var tonalPitches = require('tonal-pitches');

/**
 * Test if the given number is a valid midi note number
 * @function
 * @param {Object} num - the number to test
 * @return {Boolean} true if it's a valid midi note number
 */
const isMidi = (m) => tonalPitches.isValue(m) && !tonalPitches.isArr(m) && m >= 0 && m < 128

// To match the general midi specification where `C4` is 60 we must add 12 to
// `height` function:

/**
 * Get midi number for a pitch
 * @function
 * @param {Array|String} pitch - the pitch
 * @return {Integer} the midi number or null if not valid pitch
 * @example
 * midi('C4') // => 60
 */
function toMidi (val) {
  const p = tonalPitches.asNote(val)
  return tonalPitches.hasOct(p) ? tonalPitches.height(p) + 12
    : isMidi(val) ? +val
    : null
}

const PCS = 'C Db D Eb E F Gb G Ab A Bb B'.split(' ')
/**
 * Given a midi number, returns a note name. The altered notes will have
 * flats.
 * @function
 * @param {Integer} midi - the midi note number
 * @return {String} the note name
 * @example
 * tonal.fromMidi(61) // => 'Db4'
 */
function fromMidi (m) {
  const pc = PCS[m % 12]
  const o = Math.floor(m / 12) - 1
  return pc + o
}

exports.isMidi = isMidi;
exports.toMidi = toMidi;
exports.fromMidi = fromMidi;