import { fifths, asNotePitch, strNote, hasOct, height } from 'tonal-pitch'

/**
 * Return the chroma of a note. The chroma is the numeric equivalent to the
 * pitch class, where 0 is C, 1 is C# or Db, 2 is D... 11 is B
 *
 * @function
 * @param {String|Pitch} note
 * @return {Integer} the chroma
 */
export function chroma (n) {
  var p = asNotePitch(n)
  if (!p) return null
  var f = fifths(p)
  return 7 * f - 12 * Math.floor(f * 7 / 12)
}

/**
 * Given a note (as string or as array notation) returns a string
 * with the note name in scientific notation or null
 * if not valid note
 *
 * @function
 * @param {Pitch|String}
 * @return {String}
 * @example
 * import { noteName } from 'tonal-notes'
 * ['c', 'db3', '2', 'g+', 'gx4'].map(noteName)
 * // => ['C', 'Db3', null, null, 'G##4']
 *
 * @example
 * var tonal = require('tonal')
 * tonal.noteName('cb2') // => 'Cb2'
 * tonal.map(tonal.noteName, 'c db3 2 g+ gx4')
 */
export function noteName (n) {
  var p = asNotePitch(n)
  return p ? strNote(p) : null
}

/**
 * Get pitch class of a note. The note can be a string or a pitch array.
 *
 * @function
 * @param {String|Pitch}
 * @return {String} the pitch class
 * @example
 * tonal.pc('Db3') // => 'Db'
 */
export function pc (n) {
  var p = asNotePitch(n)
  return p ? strNote([ p[0], [ fifths(p) ] ]) : null
}

// MIDI
// ====

/**
 * Test if the given number is a valid midi note number
 * @function
 * @param {Object} num - the thing to be tested
 * @return {Boolean} true if it's a valid midi note number
 */
export function isMidiNum (m) {
  return (typeof m === 'number' || /^\d+$/.test(m)) && m >= 0 && m < 128
}

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
export function toMidi (val) {
  var p = asNotePitch(val)
  return !p ? null
    : hasOct(p) ? height(p) + 12
    : isMidiNum(val) ? +val
    : null
}

var FLATS = 'C Db D Eb E F Gb G Ab A Bb B'.split(' ')
var SHARPS = 'C C# D D# E F F# G G# A A# B'.split(' ')

function fromMidiFn (pcs) {
  return function (m) {
    var pc = pcs[m % 12]
    var o = Math.floor(m / 12) - 1
    return pc + o
  }
}

/**
 * Given a midi number, returns a note name. The altered notes will have
 * flats.
 * @function
 * @param {Integer} midi - the midi note number
 * @return {String} the note name
 * @example
 * tonal.fromMidi(61) // => 'Db4'
 */
export var fromMidi = fromMidiFn(FLATS)

/**
 * Given a midi number, returns a note name. The altered notes will have
 * sharps.
 * @function
 * @param {Integer} midi - the midi note number
 * @return {String} the note name
 * @example
 * tonal.fromMidiS(61) // => 'C#4'
 */
export var fromMidiS = fromMidiFn(SHARPS)
