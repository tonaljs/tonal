import { fromName, names as nms } from 'tonal-dictionary'
import { map, fromSemitones, asArr, range, transpose, scaleFilter } from 'tonal'

var DATA = require('./tunings.json')

/**
 * Given a tuning name, returns the notes of the strings in the open position
 * @param {String} name - the tuning name
 * @param {Array} the string notes or null if not valid tuning name
 */
export var tuning = fromName(null, DATA)

/**
 * Get all available tuning names
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
