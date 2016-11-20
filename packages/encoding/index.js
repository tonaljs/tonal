/**
 * Functions to encoding and decoding pitches into fifths/octaves notation.
 *
 * This functions are very low level and it's probably you wont need them. That's
 * why __this module is NOT exported in the tonal package__.
 *
 * @private
 * @module encoding
 */

function isNum (n) { return typeof n === 'number' }

// Map from letter step to number of fifths starting from 'C':
// { C: 0, D: 2, E: 4, F: -1, G: 1, A: 3, B: 5 }
var FIFTHS = [0, 2, 4, -1, 1, 3, 5]
// Given a number of fifths, return the octaves they span
function fOcts (f) { return Math.floor(f * 7 / 12) }
// Get the number of octaves it span each step
var FIFTH_OCTS = FIFTHS.map(fOcts)

export function encode (step, alt, oct) {
  var f = FIFTHS[step] + 7 * alt
  if (!isNum(oct)) return [f]
  var o = oct - FIFTH_OCTS[step] - 4 * alt
  return [f, o]
}

// Return the number of fifths as if it were unaltered
function unaltered (f) {
  var i = (f + 1) % 7
  return i < 0 ? 7 + i : i
}

// We need to get the steps from fifths
// Fifths for CDEFGAB are [ 0, 2, 4, -1, 1, 3, 5 ]
// We add 1 to fifths to avoid negative numbers, so:
// for ['F', 'C', 'G', 'D', 'A', 'E', 'B'] we have:
var STEPS = [3, 0, 4, 1, 5, 2, 6]

/**
 * Decode a encoded pitch
 * @param {Number} fifths - the number of fifths
 * @param {Number} octs - the number of octaves to compensate the fifhts
 * @return {Array} in the form [step, alt, oct]
 */
export function decode (f, o) {
  var step = STEPS[unaltered(f)]
  var alt = Math.floor((f + 1) / 7)
  if (!isNum(o)) return [step, alt]
  var oct = o + 4 * alt + FIFTH_OCTS[step]
  return [step, alt, oct]
}
