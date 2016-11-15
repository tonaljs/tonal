/**
 * Work with scales
 *
 * @module scale
 */
import { get as getter, keys } from 'tonal-dictionary'
import { parseIvl, parseNote } from 'tonal-pitch'
import { harmonize } from 'tonal-array'

var DATA = require('./scales.json')

var dict = getter(parseIvl, DATA)

/**
 * Create scales by scale type or intervals and tonic. The returned scale is an
 * array of notes (or intervals if you specify `false` as tonic)
 *
 * This function is currified
 *
 * @param {String} source - the scale type, intervals or notes
 * @param {String} tonic - the scale tonic (or false to get intervals)
 * @return {Array} the scale notes
 *
 * @example
 * var scale = require('tonal-scale')
 * // get scale notes using type and tonic
 * scale.build('maj7', 'C2') // => ['C2', 'E2', 'G2', 'B2']
 * // get scale intervals (tonic false)
 * scale.build('maj7', false) // => ['1P', '3M', '5P', '7M']
 * // partially applied
 * var maj7 = scale.build('maj7')
 * maj7('C') // => ['C', 'E', 'G', 'B']
 * // build scale from intervals
 * scale.build('1 3 5 m7 m9', 'C') // => ['C', 'E', 'G', 'Bb', 'Db']
 */
export function build (src, tonic) {
  if (arguments.length === 1) return function (t) { return build(src, t) }
  return harmonize(get(src) || src, tonic)
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
export var names = keys(DATA)

/**
 * Get scale notes from scale name
 *
 * @param {String} name - the scale name
 * @return {Array} the scale notes
 *
 * @example
 * var scale = require('tonal-scale')
 * scale.get('C7') // => ['C', 'E', 'G', 'Bb']
 * scale.get('CMaj7') // => ['C', 'E', 'G', 'B']
 */
export function get (name) {
  var i = name.indexOf(' ')
  var tonic = name.substring(0, i)
  return parseNote(tonic) ? harmonize(dict(name.substring(i + 1)), tonic)
    : harmonize(dict(name), false)
}
