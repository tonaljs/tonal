/**
 * A collection of function to build chords. It includes a chord dictionary.
 *
 * @module chord
 */
import { get as getter, keys } from 'tonal-dictionary'
import { parseIvl } from 'tonal-pitch'
import { regex } from 'note-parser'
import { harmonize } from 'tonal-harmonizer'

var DATA = require('./chords.json')

var dict = getter(parseIvl, DATA)

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
 * var chord = require('tonal-chord')
 * chord.names() // => ['maj7', ...]
 */
export var names = keys(DATA)

/**
 * Get chord notes from chord name
 *
 * @param {String} name - the chord name
 * @return {Array} the chord notes
 *
 * @example
 * var chords = require('tonal-chords')
 * chords.get('C7') // => ['C', 'E', 'G', 'Bb']
 * chords.get('CMaj7') // => ['C', 'E', 'G', 'B']
 */
export function get (name) {
  var p = regex().exec(name)
  if (!p) return []
  // it has note and chord name
  if (p[4]) return build(p[4], p[1] + p[2] + p[3])
  return build(p[3], p[1] + p[2])
}

/**
 * Try to parse a chord name. It returns an array with the chord name and
 * the tonic. If not tonic is found, all the name is considered the chord
 * name
 * @param {String} name - the chord name
 * @return {Array} an array with [chordType, tonic]
 * @example
 * chord.parse('Cmaj7') // => ['maj7', 'C']
 * chord.parse('C7') // => ['7', 'C']
 * chord.parse('mMaj7') // => ['mMaj7', null]
 */
export function parse (name) {
  var p = regex().exec(name)
  if (!p) return [name, null]
  // it can have a chord name: Cmaj7 is ['maj7', 'C']
  // or if not, the octave is treated as chord name: C7 is ['7', 'C']
  // doesn't have chord name: the name is the octave (example: 'C7' is dominant)
  return p[4] ? [p[4], p[1] + p[2] + p[3]] : [p[3], p[1] + p[2]]
}

export default get
