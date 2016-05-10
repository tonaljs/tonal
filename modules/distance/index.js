import { isPC, fifths, focts, pitch, height, asPitch, strIvl } from 'tonal-pitch'

// substract two pitches
function substr (a, b) {
  if (!a || !b || a[1].length !== b[1].length) return null
  var f = fifths(b) - fifths(a)
  if (isPC(a)) return pitch(f, -Math.floor(f * 7 / 12), 1)
  var o = focts(b) - focts(a)
  var d = height(b) - height(a) < 0 ? -1 : 1
  return pitch(d * f, d * o, d)
}

/**
 * Find distance between two pitches. Both pitches MUST be of the same type.
 * Distances between pitch classes always returns ascending intervals.
 * Distances between intervals substract one from the other.
 *
 * @param {Pitch|String} from - distance from
 * @param {Pitch|String} to - distance to
 * @return {Interval} the distance between pitches
 * @example
 * import { distance } from 'tonal-distance'
 * distance('C2', 'C3') // => 'P8'
 * distance('G', 'B') // => 'M3'
 * // or use tonal
 * var tonal = require('tonal')
 * tonal.distance('M2', 'P5') // => 'P4'
 */
export function distance (a, b) {
  if (arguments.length === 1) return function (b) { return distance(a, b) }
  var pa = asPitch(a)
  var pb = asPitch(b)
  var i = substr(pa, pb)
  // if a and b are in array notation, no conversion back
  return a === pa && b === pb ? i : strIvl(i)
}

/**
 * Get the distance between two notes in semitones
 * @param {String|Pitch} from - first note
 * @param {String|Pitch} to - last note
 * @return {Integer} the distance in semitones or null if not valid notes
 * @example
 * import { distInSemitones } from 'tonal-distance'
 * distInSemitones('C3', 'A2') // => -3
 * // or use tonal
 * tonal.distInSemitones('C3', 'G3') // => 7
 */
export function distInSemitones (a, b) {
  var i = substr(asPitch(a), asPitch(b))
  return i ? height(i) : null
}

/**
 * An alias for `distance`
 * @function
 */
export var interval = distance
