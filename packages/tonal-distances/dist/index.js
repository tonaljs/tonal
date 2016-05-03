'use strict';

var tonalPitches = require('tonal-pitches');

function trBy (i, p) {
  if (p === null) return null
  const f = i[1] + p[1]
  if (p.length === 2) return tonalPitches.pcPitch(f)
  const o = i[2] + p[2]
  if (p.length === 3) return tonalPitches.notePitch(f, o)
  return tonalPitches.ivlPitch(f, o)
}

/**
 * Transpose notes. Can be used to add intervals
 * @function
 */
function transpose (a, b) {
  if (arguments.length === 1) return (b) => transpose(a, b)
  const pa = tonalPitches.asPitch(a)
  const pb = tonalPitches.asPitch(b)
  const r = tonalPitches.isIvlPitch(pa) ? trBy(pa, pb)
    : tonalPitches.isIvlPitch(pb) ? trBy(pb, pa) : null
  return a === pa && b === pb ? r : tonalPitches.toPitchStr(r)
}

/**
 * Transpose notes. An alias for `transpose`
 * @function
 */
const tr = transpose

// ### 2.2 Distances (in intervals)

// substract two pitches
function substr (a, b) {
  if (a.length !== b.length) return null
  return tonalPitches.isPitchClass(a)
    ? tonalPitches.ivlPitch(b[1] - a[1])
    : tonalPitches.ivlPitch(b[1] - a[1], b[2] - a[2])
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
function interval (a, b) {
  if (arguments.length === 1) return (b) => distance(a, b)
  const pa = tonalPitches.asPitch(a)
  const pb = tonalPitches.asPitch(b)
  const i = substr(pa, pb)
  // if a and b are in array notation, no conversion back
  return a === pa && b === pb ? i : tonalPitches.toIvlStr(i)
}

/**
 * An alias for `distance`
 * @function
 */
const distance = interval
/**
 * An alias for `distance`
 * @function
 */
const dist = interval


/**
 * Transpose a tonic a number of perfect fifths.
 * @function
 * @param {Pitch|String} tonic
 * @param {Integer} number - the number of times
 * @return {String|Pitch} the transposed note
 */
function fifthsFrom (t, n) {
  if (arguments.length > 1) return fifthsFrom(t)(n)
  return (n) => tr(t, tonalPitches.ivlPitch(n, 0))
}

exports.transpose = transpose;
exports.tr = tr;
exports.interval = interval;
exports.distance = distance;
exports.dist = dist;
exports.fifthsFrom = fifthsFrom;