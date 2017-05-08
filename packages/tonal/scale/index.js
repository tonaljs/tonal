/**
 * A scale is a collection of pitches in ascending or descending order.
 *
 * This module provides functions to get and manipulate scales.
 *
 * @example
 * scale.notes('Ab bebop') // => [ 'Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'Gb', 'G' ]
 * scale.get('hungarian major', 'B3') // => [ 'B3', 'C##4', 'D#4', 'E#4', 'F#4', 'G#4', 'A4'
 * scale.get('C E F G', 'F') // => [ 'F', 'A', 'Bb', 'C' ]
 * scale.get('1P 2M 3M 5P 6M', 'D4') // => [ 'D4', 'E4', 'F#4', 'A4', 'B4' ]
 * scale.names() => ['major', 'minor', ...]
 * scale.detect('f5 d2 c5 b5 a2 e4 g') // => [ 'C major', 'D dorian', 'E phrygian', 'F lydian', 'G mixolydian', 'A aeolian', 'B locrian'])
 * @module scale
 */
import { dictionary, detector } from 'tonal-dictionary'
import { map, compact } from 'tonal-array'
import { pc, note } from 'tonal-note'
import { harmonize } from 'tonal-harmonizer'
import DATA from './scales.json'

var dict = dictionary(DATA, function (str) { return str.split(' ') })

/**
 * Transpose the given scale notes, intervals or name to a given tonic.
 * The returned scale is an array of notes (or intervals if you specify `false` as tonic)
 *
 * It returns null if the scale type is not in the scale dictionary
 *
 * This function is currified
 *
 * @param {String} source - the scale type, intervals or notes
 * @param {String} tonic - the scale tonic (or false to get intervals)
 * @return {Array} the scale notes
 *
 * @example
 * scale.get('bebop', 'Eb') // => [ 'Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'Db', 'D' ]
 * scale.get('major', false) // => [ '1P', '2M', '3M', '4P', '5P', '6M', '7M' ]
 * var major = scale.get('major')
 * major('Db3') // => [ 'Db3', 'Eb3', 'F3', 'Gb3', 'Ab3', 'Bb3', 'C4' ]
 */
export function get (type, tonic) {
  if (arguments.length === 1) return function (t) { return get(type, t) }
  var ivls = dict.get(type)
  return ivls ? harmonize(ivls, tonic) : null
}

/**
 * Return the available scale names
 *
 * @function
 * @param {boolean} aliases - true to include aliases
 * @return {Array} the scale names
 *
 * @example
 * var scale = require('tonal-scale')
 * scale.names() // => ['maj7', ...]
 */
export var names = dict.keys

/**
 * Get the notes (pitch classes) of a scale. It accepts either a scale name
 * (tonic and type) or a collection of notes.
 *
 * Note that it always returns an array, and the values are only pitch classes.
 *
 * @param {String|Array} src - the scale name (it must include the scale type and
 * a tonic. The tonic can be a note or a pitch class) or the list of notes
 * @return {Array} the scale pitch classes
 *
 * @example
 * scale.notes('C major') // => [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ]
 * scale.notes('C4 major') // => [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ]
 * scale.notes('Ab bebop') // => [ 'Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'Gb', 'G' ]
 * scale.notes('C4 D6 E2 c7 a2 b5 g2 g4 f') // => ['C', 'D', 'E', 'F', 'G', 'A', 'B']
 */
export function notes (name) {
  var scale = parse(name)
  var notes = scale.tonic ? get(scale.type, pc(scale.tonic)) : null
  return notes || compact(map(pc, name).map(function (n, i, arr) {
    // check for duplicates
    // TODO: sort but preserving the root
    return arr.indexOf(n) < i ? null : n
  }))
}

/**
 * Given a scale name, return its intervals. The name can be the type and
 * optionally the tonic (which is ignored)
 *
 * It retruns an empty array when no scale found
 *
 * @param {String} name - the scale name (tonic and type, tonic is optional)
 * @return {Array<String>} the scale intervals if is a known scale or an empty
 * array if no scale found
 * @example
 * scale.intervals('C major')
 */
export function intervals (name) {
  var scale = parse(name)
  return get(scale.type, false) || []
}

/**
 * Check if the given name (and optional tonic and type) is a know scale
 * @param {String} name - the scale name
 * @return {Boolean}
 * @example
 * scale.intervals('C major') // => [ '1P', '2M', '3M', '4P', '5P', '6M', '7M' ])
 * scale.intervals('major') // => [ '1P', '2M', '3M', '4P', '5P', '6M', '7M' ])
 * scale.intervals('mixophrygian') // => null
 */
export function isKnowScale (name) {
  return intervals(name).length > 0
}

/**
 * Given a string try to parse as scale name. It retuns an object with the
 * form { tonic, type } where tonic is the note or false if no tonic specified
 * and type is the rest of the string minus the tonic
 *
 * Note that this function doesn't check that the scale type is a valid scale
 * type or if is present in any scale dictionary.
 *
 * @param {String} name - the scale name
 * @return {Object} an object { tonic, type }
 * @example
 * scale.parse('C mixoblydean') // => { tonic: 'C', type: 'mixoblydean' }
 * scale.parse('anything is valid') // => { tonic: false, type: 'anything is valid'}
 */
export function parse (str) {
  if (typeof str !== 'string') return null
  var i = str.indexOf(' ')
  var tonic = note(str.substring(0, i)) || false
  var type = tonic ? str.substring(i + 1) : str
  return { tonic: tonic, type: type }
}

/**
 * Detect a scale. Given a list of notes, return the scale name(s) if any.
 * It only detects chords with exactly same notes.
 *
 * @function
 * @param {Array|String} notes - the list of notes
 * @return {Array<String>} an array with the possible scales
 * @example
 * scale.detect('b g f# d') // => [ 'GMaj7' ]
 * scale.detect('e c a g') // => [ 'CM6', 'Am7' ]
 */
export var detect = detector(dict, ' ')
