import { fromName, names as dictN } from 'tonal-dictionary'
import { parseIvl } from 'tonal-pitch'
import { regex } from 'note-parser'
import { harmonize } from 'tonal-array'

var DATA = require('./chords.json')

var dict = fromName(parseIvl, DATA)

/**
 * Create chords by chord type or intervals and tonic. The returned chord is an
 * array of notes (or intervals if you specify `false` as tonic)
 *
 * This function is currified
 *
 * @param {String} source - the chord type, intervals or notes
 * @param {String} tonic - the chord tonic (or false to get intervals)
 * @return {Array} the chord notes
 *
 * @example
 * var chord = require('tonal-chord')
 * // get chord notes using type and tonic
 * chord.build('maj7', 'C2') // => ['C2', 'E2', 'G2', 'B2']
 * // get chord intervals (tonic false)
 * chord.build('maj7', false) // => ['1P', '3M', '5P', '7M']
 * // partially applied
 * var maj7 = chord.build('maj7')
 * maj7('C') // => ['C', 'E', 'G', 'B']
 * // create chord from intervals
 * chord.build('1 3 5 m7 m9', 'C') // => ['C', 'E', 'G', 'Bb', 'Db']
 */
export function build (src, tonic) {
  if (arguments.length === 1) return function (t) { return build(src, t) }
  return harmonize(dict(src) || src, tonic)
}

/**
 * Return the available chord names
 *
 * @function
 * @param {boolean} aliases - true to include aliases
 * @return {Array} the chord names
 *
 * @example
 * import { chordNames } from 'tonal-chords'
 * chordNames() // => ['maj7', ...]
 */
export var names = dictN(DATA)

/**
 * Get chord notes from chord name
 *
 * @param {String} name - the chord name
 * @return {Array} the chord notes
 *
 * @example
 * import { fromName } from 'tonal-chords'
 * fromName('C7') // => ['C', 'E', 'G', 'Bb']
 * fromName('CMaj7') // => ['C', 'E', 'G', 'B']
 */
export function get (name) {
  var p = regex().exec(name)
  if (!p) return []
  // it has note and chord name
  if (p[4]) return build(p[4], p[1] + p[2] + p[3])
  // doesn't have chord name: the name is the octave (example: 'C7' is dominant)
  return build(p[3], p[1] + p[2])
}
