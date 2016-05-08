import { pitch, pType, fifths, focts, height, isPC,
  asPitch, isIvlPitch, strPitch } from 'tonal-pitch'

function trBy (i, p) {
  var t = pType(p)
  if (!t) return null
  var f = fifths(i) + fifths(p)
  if (isPC(p)) return ['tnlp', [f]]
  var o = focts(i) + focts(p)
  if (t === 'note') return ['tnlp', [f, o]]
  var d = height(i) + height(p) < 0 ? -1 : 1
  return ['tnlp', [d * f, d * o], d]
}

/**
 * Transpose notes. Can be used to add intervals. At least one of the parameter
 * is expected to be an interval. If not, it returns null.
 *
 * @param {String|Pitch} a - a note or interval
 * @param {String|Pitch} b - a note or interavl
 * @return {String|Pitch} the transposed pitch or null if not valid parameters
 */
export function transpose (a, b) {
  if (arguments.length === 1) return function (b) { return transpose(a, b) }
  var pa = asPitch(a)
  var pb = asPitch(b)
  var r = isIvlPitch(pa) ? trBy(pa, pb)
    : isIvlPitch(pb) ? trBy(pb, pa) : null
  return a === pa && b === pb ? r : strPitch(r)
}

/**
 * An alias for `transpose`
 * @function
 */
export var tr = transpose

/**
 * Transpose a tonic a number of perfect fifths. It can be partially applied.
 *
 * @function
 * @param {Pitch|String} tonic
 * @param {Integer} number - the number of times
 * @return {String|Pitch} the transposed note
 * @example
 * import { trFifths } from 'tonal-transpose'
 * [0, 1, 2, 3, 4].map(trFifths('C')) // => ['C', 'G', 'D', 'A', 'E']
 * // or using tonal
 * tonal.trFifths('G4', 1) // => 'D5'
 */
export function trFifths (t, n) {
  if (arguments.length > 1) return trFifths(t)(n)
  return function (n) {
    return tr(t, pitch(n, 0, 1))
  }
}
