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
 * import { scaleFilter } from 'tonal-filter'
 * scaleFilter('C D E', 'C4') // => 'C4'
 * scaleFilter('C D E', 'B#3') // => 'C4'
 * scaleFilter('C D E', 60) // => 'C4'
 * aMajor = scaleFilter('A C# E')
 * [69, 70, 71, 72, 73].map(aMajor) // => [ 'A4', null, null, null, 'C#5' ]
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
