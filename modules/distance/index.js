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
 * var tonal = require('tonal')
 * tonal.distance('C2', 'C3') // => 'P8'
 * tonal.distance('G', 'B') // => 'M3'
 * tonal.distance('M2', 'P5') // => 'P4'
 */
export function interval (a, b) {
  if (arguments.length === 1) return (b) => distance(a, b)
  const pa = asPitch(a)
  const pb = asPitch(b)
  const i = substr(pa, pb)
  // if a and b are in array notation, no conversion back
  return a === pa && b === pb ? i : strIvl(i)
}

/**
 * An alias for `distance`
 * @function
 */
export const distance = interval
