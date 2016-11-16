/**
 * Filter notes by a scale (a pitch set)
 *
 * @example
 * var tonal = require('tonal')
 * tonal.scaleFilter('c d e f g a b', 'c db d eb e') // => ['C', null, 'D', null, 'E']
 * @module filter
 */
import { pc, chroma } from 'tonal-note'
import { map } from 'tonal-array'
import { toMidi } from 'tonal-midi'

/**
 * This function filter notes using a scale. Given a scale and a note, it
 * returns the note name if it belongs to the scale or null if not. The
 * note can be given as string or as midi number.
 *
 * This function work with heights instead of names, so the note name returned
 * is not guaranteed to be the same provided (see 'B#3' example)
 *
 * It can be partially applied.
 *
 * @param {String|Array} scale - the scale used to filter
 * @param {String|Pitch|Number} note - the note to be filtered
 * @return {String} the note name or null if note in the pitch classes
 *
 * @example
 * var filter = require('tonal-filter')
 * var inC = filter.byScale('c d e f g a b')
 * inC('c4') // => true
 * filter.all(inC, 'c2 c#2 d3 eb3 e4 f5') // => ['']
 * isAMajor = scaleFilter('A C# E')
 * isAMajor('c#2') // => true
 * // work with midi numbers
 * isAMajor(69) // => true
 */
export function scaleFilter (notes, m) {
  if (arguments.length > 1) return scaleFilter(notes)(m)
  var scale = map(pc, notes)
  var chromas = map(chroma, scale)
  return function (note) {
    var midi = toMidi(note)
    var m = midi !== null ? midi - 12 : chroma(note)
    var pcIndex = chromas.indexOf(m % 12)
    return pcIndex > -1 ? scale[pcIndex] + Math.floor(m / 12) : null
  }
}
