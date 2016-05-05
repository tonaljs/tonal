import { chroma } from 'tonal-pitches'
import { pc } from 'tonal-notes'
import { map } from 'tonal-arrays'
import { fifthsFrom } from 'tonal-distances'
import { toMidi, fromMidi } from 'tonal-midi'

const isNum = (n) => typeof n === 'number'
// ascending range
const ascR = (b, n) => { for (var a = []; n--; a[n] = n + b); return a }
// descending range
const descR = (b, n) => { for (var a = []; n--; a[n] = b - n); return a }

/**
 * Create a midi range. As parameters, it accepts numbers or note names.
 * It can create ascending or descending ranges. Although midi notes ranges from
 * 1 to 128 this function can create unlimited numeric ranges (even with
 * negative numbers)
 *
 * @param {Pitch|String|Number} begin - the beginning note or number
 * @param {Pitch|String|Number} end - the end note or number
 * @return {Array} an array of numbers or empty array if not valid parameters
 *
 * @example
 * var range = require('tonal-ranges')
 * range.midiRange('C5', 'C4') // => [ 72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62, 61, 60 ]
 * range.midiRange(10, 5) // => [ 10, 9, 8, 7, 6, 5 ]
 */
export function midiRange (a, b) {
  const ma = isNum(a) ? a : toMidi(a)
  const mb = isNum(b) ? b : toMidi(b)
  return ma === null || mb === null ? []
    : ma < mb ? ascR(ma, mb - ma + 1) : descR(ma, ma - mb + 1)
}

const buildNote = (pc, midi) => pc + (Math.floor(midi / 12) - 1)

/**
 * Given a collection of pitch classes and a midi number, return the note name
 * from the collection or null if not in the collection.
 *
 * This function can be partially applied.
 *
 * @param {Array} coll - the pitch classes collection
 * @param {Number} midi - the midi number
 * @return {String} the note name or null if note in the pitch classes
 *
 * @example
 * var fromPitchSet = require('note-ranges').fromPitchSet
 * fromPitchSet('C D E', 60) // => 'C4'
 * aMajor = fromPitchSet('A C# E')
 * [69, 70, 71, 72, 73].map(aMajor) // => [ 'A4', null, null, null, 'C#5' ]
 */
export function fromPitchSet (notes, m) {
  if (arguments.length > 1) return fromPitchSet(notes)(m)
  const scale = map(pc, notes)
  const chromas = map(chroma, scale)
  return (midi) => {
    const pcIndex = chromas.indexOf(midi % 12)
    return pcIndex > -1 ? buildNote(scale[pcIndex], midi) : null
  }
}

/**
 * Create a note range using a function that convert from midi number to
 * note names
 *
 * Can be partially applied
 *
 * @param {Function} gen - the note name generator. Its a function with signature
 * (Number) => (String) that receives a note midi number and returns a note name
 * @param {String|Pitch|Integer} start - the first note (or midi number) of the range
 * @param {String|Pitch|Integer} end - the last note (or midi number) of the range
 * @return {Array} an array of note names
 */
export function noteRange (fn, a, b) {
  if (arguments.length === 1) return (a, b) => noteRange(fn, a, b)
  return midiRange(a, b).map(fn).filter((x) => x !== null)
}

/**
 * Create a range of chromatic notes. The altered notes will use flats.
 * @function
 * @param {String|Pitch|Integer} start - the first note (or midi number) of the range
 * @param {String|Pitch|Integer} end - the last note (or midi number) of the range
 * @return {Array} an array of note names
 * @example
 * tonal.chromatic('C2', 'E2') // => ['C2', 'Db2', 'D2', 'Eb2', 'E2']
 */
export const chromatic = noteRange(fromMidi)

// #### Cycle of fifths

/**
 * Create a range with a cycle of fifths
 * @function
 * @param {Integer} the first step from tonic
 * @param {Integer} the last step from tonic (can be negative)
 * @param {String|Pitch} the tonic
 * @return {Array} a range of cycle of fifths
 * @example
 * var range = require('tonal-ranges')
 * range.cycleOfFifths(0, 6, 'C') // => [ 'C', 'G', 'D', 'A', 'E', 'B', 'F#' ])
 */
export const cycleOfFifths = (s, e, t) => midiRange(s, e).map(fifthsFrom(t))

/**
 * Create a scale range. Given a pitch set (a collection of pitch classes),
 * and a start and end it returns a note range.
 *
 * @param {String|Array} notes - the collection of pitch sets
 * @param {String} start - the first note of the range
 * @param {String} end - the last note of the range
 * @return {Array} the scale range, an empty array if not valid source or
 * null if not valid start or end
 * @example
 * var range = require('tonal-ranges')
 * range.scale('C D E F G A B', 'C3', 'C2')
 * // => [ 'C3', 'B2', 'A2', 'G2', 'F2', 'E2', 'D2', 'C2' ]
 */
export function scaleRange (src, start, end) {
  return noteRange(fromPitchSet(src), start, end)
}
