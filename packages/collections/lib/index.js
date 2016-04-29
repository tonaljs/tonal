import { isNum, isArr, asPitch, id, isPitch, toPitchStr } from 'tonal-pitches'
import { tr, fifthsFrom } from 'tonal-distances'
import { toMidi, fromMidi } from 'tonal-midi'

// items can be separated by spaces, bars and commas
const SEP = /\s*\|\s*|\s*,\s*|\s+/
/**
 * Split a string by spaces (or commas or bars). Always returns an array, even if its empty
 * @param {String|Array|Object} source - the thing to get an array from
 * @return {Array} the object as an array
 */
export function asList (src) {
  return isArr(src) ? src
    : typeof src === 'string' ? src.trim().split(SEP)
    : (src === null || typeof src === 'undefined') ? []
    : [ src ]
}

/**
 * Map a list with a function
 *
 * Can be partially applied.
 *
 * @param {Function}
 * @param {String|Array}
 * @return {Array}
 */
export function map (fn, list) {
  return arguments.length > 1 ? map(fn)(list) : (l) => asList(l).map(fn)
}

/**
 * Filter a list with a function
 *
 * Can be partially applied.
 *
 * @param {Function}
 * @param {String|Array}
 * @return {Array}
 */
export function filter (fn, list) {
  return arguments.length > 1 ? filter(fn)(list) : (l) => asList(l).filter(fn)
}

// #### Transform lists in array notation

const listToStr = (v) => isPitch(v) ? toPitchStr(v) : isArr(v) ? v.map(toPitchStr) : v

/**
 * Decorates a function to work with lists in pitch array notation
 * @function
 */
export const listFn = (fn) => (src) => {
  const param = asList(src).map(asPitch)
  const result = fn(param)
  return listToStr(result)
}

// #### Transpose lists

/**
 * Create an harmonizer: a function that given a note returns a list of notes.
 *
 * @function
 * @param {String|Array} list
 * @return {Function}
 */
export const harmonizer = (list) => (pitch) => {
  return listFn((list) => list.map(tr(pitch || 'P1')).filter(id))(list)
}

/**
 * Harmonizes a list with a pitch
 *
 * @function
 * @param {String|Array} list
 * @param {String|Pitch} pitch
 * @return {Array}
 */
export const harmonize = function (list, pitch) {
  return arguments.length > 1 ? harmonizer(list)(pitch) : harmonizer(list)
}

// #### Ranges

// ascending range
const ascR = (b, n) => { for (var a = []; n-- ; a[n] = n + b ); return a; }
// descending range
const descR = (b, n) => { for (var a = []; n-- ; a[n] = b - n ) ; return a; }

/**
 * Create a range. It works with numbers or note names
 * @function
 */
export function range (a, b) {
  const ma = isNum(a) ? a : toMidi(a)
  const mb = isNum(b) ? b : toMidi(b)
  return ma === null || mb === null ? []
    : ma < mb ? ascR(ma, mb - ma + 1) : descR(ma, ma - mb + 1)
}

/**
 * Create a note range
 * @function
 */
export function noteRange (fn, a, b) {
  if (arguments.length === 1) return (a, b) => noteRange(fn, a, b)
  return range(a, b).map(fn).filter((x) => x !== null )
}

/**
 * Create a range of chromatic notes
 * @function
 * @example
 * tonal.chromatic('C2', 'E2') // => ['C2', 'Db2', 'D2', 'Eb2', 'E2']
 */
export const chromatic = noteRange(fromMidi)

// #### Cycle of fifths

/**
 * Create a range with a cycle of fifths
 * @function
 * @param {Integer} the first step from tonic
 * @param {Integer} the last step from tonic (can be negative)
 * @param {String|Pitch} the tonic
 * @return {Array} a range of cycle of fifths
 */
export const cycleOfFifths = (s, e, t) => range(s, e).map(fifthsFrom(t))

// #### Sort lists

const objHeight = function (p) {
  if (!p) return -Infinity
  const f = p[1] * 7
  const o = isNum(p[2]) ? p[2] : -Math.floor(f / 12) - 10
  return f + o * 12
}

const ascComp = (a, b) => objHeight(a) - objHeight(b)
const descComp = (a, b) => -ascComp(a, b)

export function sort (comp, list) {
  if (arguments.length > 1) return sort(comp)(list)
  const fn = comp === true || comp === null ? ascComp
    : comp === false ? descComp : comp
  return listFn((arr) => arr.sort(fn))
}
