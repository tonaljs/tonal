import { fromName, names as nms } from 'tonal-dictionary'
import { map, fromSemitones, asArr, range, transpose, scaleFilter, pc } from 'tonal'

var DATA = require('./tunings.json')

/**
 * Given a tuning name, returns the notes of the strings in the open position
 * @function
 * @param {String} name - the tuning name
 * @return {Array} the string notes or null if not valid tuning name
 * @example
 * var fret = require('tonal-fretboard')
 * fret.tuning('guitar') // => [ 'E2', 'A2', 'D3', 'G3', 'B3', 'E4' ]
 * fret.tuning('charango') // => [ 'G4', 'G4', 'C5', 'C5', 'E5', 'E4', 'A4', 'A4', 'E5', 'E5' ]
 */
export var tuning = fromName(null, DATA)

/**
 * Given a tuning name returns the notes of the strings in open position
 * as pitch classes removing doubled strings.
 * @param {String} name - the tuning name or notes of the strings in open position
 * @return {Array} the string notes as pitch classes
 * @example
 * fret.simpleTuning('guitar') => [ 'E', 'A', 'D', 'G', 'B', 'E' ]
 * fret.simpleTuning('charango') => [ 'G', 'C', 'E', 'A', 'E' ]
 */
export function simpleTuning (src) {
  var pcs = map(pc, tuning(src) || src)
  var simple = pcs.reduce(function (s, pc, i) {
    if (s === false) return s
    else if (i % 2 === 0) s.push(pc)
    else if (s[s.length - 1] !== pc) return false
    return s
  }, [])
  return simple || pcs
}

/**
 * Get all available tuning names
 * @function
 * @param {Boolean} aliases - get aliases or not
 * @return {Array} an array of tuning names
 */
export var names = nms(DATA)

/**
 * Build a fretboard using a given tuning (or tuning name) and first and last
 * fret numbers
 * @param {String|Array} tuning - the tuning name or notes
 * @param {Integer} first - the first fret number
 * @param {Integer} last - the last fret number
 * @return {Array} An array of arrays, one for each string
 */
export function build (tun, first, last) {
  var ivls = range([first, last]).map(fromSemitones)
  var notes = tuning(tun) || asArr(tun)
  return notes.map(function (b) {
    return ivls.map(transpose(b))
  })
}

/**
 * Build a fretboard only showing the notes for the given scale.
 * @param {String|Array} tuning - the tuning name or notes
 * @param {String|Array} scale - the scale notes
 * @param {Integer} first - the first fret number
 * @param {Integer} last - the last fret number
 * @return {Array} An array of arrays, one for each string
 */
export function scale (tuning, scale, first, last) {
  var filter = map(scaleFilter(scale))
  return build(tuning, first, last).map(filter)
}
