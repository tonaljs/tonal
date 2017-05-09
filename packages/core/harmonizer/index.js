/**
 * Functions to transpose o calculate distances from a collection of notes.
 *
 * A useful concept is _harmonizer_: a function that _harmonizes_ notes. It can
 * be created by partially applying the `harmonize` function (see examples)
 *
 * @example
 * var harmonizer = require('tonal-harmonizer')
 * harmonizer.harmonize('1P 3M 5P', 'C') // => ['C', 'E', 'G']
 * var maj7 = harmonizer.harmonize('1P 3M 5P 7M')
 * maj7('D4') // =>  ['D4', 'F#4', 'A4', 'C#5']
 * harmonizer.harmonics('C E G') // => ['1P', '3M', '5P']
 *
 * @example
 * // in tonal this functions are NOT namespaced
 * var tonal = require('tonal')
 * tonal.harmonize('1P 3M 5P', 'G')
 *
 * @example
 * // using ES6 import syntax
 * import { harmonize } from 'tonal-harmonizer'
 * harmonize(...)
 *
 * @module harmonizer
 */
import { transpose as tr } from 'tonal-transpose'
import { interval } from 'tonal-distance'
import { asArr, map, compact } from 'tonal-array'

/**
 * Given a list of notes, return the distance from the first note to the rest.
 * @param {Array|String} notes - the list of notes
 * @return {Array} the intervals relative to the first note
 * @example
 * harmonizer.harmonics('C E G') // => ['1P', '3M', '5P']
 *
 * @example
 * // in tonal this functions are NOT namespaced
 * tonal.harmonics(tonal.scale('C major')) // => ['1P', ...]
 */
export function harmonics (list) {
  var a = asArr(list)
  return a.length ? compact(a.map(interval(a[0]))) : a
}

/**
 * Given a list of notes, return the intervallic structure: the distance from
 * one to the next.
 *
 * Notice that the number of intervals is one less that the number of notes.
 *
 * @param {Array|String} notes - the list of notes
 * @return {Array} the intervals relative to the previous
 * @example
 * harmonizer.intervallic('c e g') // => ['3M', '3m']
 * harmonizer.intervallic('e g c') // => ['3m', '4P']
 * harmonizer.intervallic('c') // => []
 */
export function intervallic (notes) {
  var dist = []
  notes = asArr(notes)
  for (var i = 1; i < notes.length; i++) {
    dist.push(interval(notes[i - 1], notes[i]))
  }
  return dist
}

/**
 * Given a list of intervals and a tonic, return that tonic transposed
 * to that intervals.
 *
 * It's currified and, calling with only one parameter, returns an harmonizer,
 * a function that harmonizes any note (see example)
 *
 * @function
 * @param {String|Array} list - the list of intervals
 * @param {String|Pitch} note - the note to be harmonized
 * @return {Array} the resulting notes
 * @example
 * harmonizer.harmonize('P1 M3 P5 M7', 'C') // => ['C', 'E', 'G', 'B']
 * @example
 * // harmonizer with partial application
 * var maj7 = harmonize.harmonizer('P1 M3 P5 M7')
 * maj7('C') // => ['C', 'E', 'G', 'B']
 * @example
 * // in tonal this function is NOT namespaced
 * var C = tonal.harmonizer('C D E')
 * C('M3') // => ['E', 'G#', 'B']
 */
export function harmonize (list, pitch) {
  if (arguments.length > 1) return harmonize(list)(pitch)
  return function (tonic) {
    return compact(map(tr(tonic || 'P1'), list))
  }
}
