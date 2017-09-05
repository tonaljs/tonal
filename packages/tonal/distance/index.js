/**
 * [![npm version](https://img.shields.io/npm/v/tonal-distance.svg)](https://www.npmjs.com/package/tonal-distance)
 * [![tonal](https://img.shields.io/badge/tonal-distance-yellow.svg)](https://github.com/danigb/tonal/tree/master/packages/tonal/distance)
 * 
 * Transpose notes by intervals and find distances between notes
 *
 * @example
 * // using ES6 import
 * import { interval, semitones, transpose } from 'tonal-distance'
 * semitones('C' ,'D') // => 2
 * interval('C4', 'G4') // => '5P'
 * transpose('C4', 'P5') // => 'G4'
 *
 * // included in tonal facade
 * const tonal = require('tonal');
 * tonal.distance.transpose('C4', 'P5')
 * tonal.distance.transposeBy('P5', 'C4')
 * 
 * @module distance
 */
import {
  isPC,
  fifths,
  focts,
  pitch,
  height,
  pType,
  strPitch,
  asPitch,
  strIvl
} from "tonal-pitch";

function trBy(i, p) {
  var t = pType(p);
  if (!t) return null;
  var f = fifths(i) + fifths(p);
  if (isPC(p)) return ["tnlp", [f]];
  var o = focts(i) + focts(p);
  if (t === "note") return ["tnlp", [f, o]];
  var d = height(i) + height(p) < 0 ? -1 : 1;
  return ["tnlp", [d * f, d * o], d];
}

/**
 * Transpose a note by an interval. The note can be a pitch class.
 * 
 * This function can be partially applied.
 * 
 * @param {String} note
 * @param {String} interval
 * @return {String} the transposed note
 * @example
 * import { tranpose } from 'tonal-distance'
 * transpose('d3', '3M') // => 'F#3'
 * // it works with pitch classes
 * transpose('D', '3M') // => 'F#'
 * // can be partially applied
 * ['C', 'D', 'E', 'F', 'G'].map(transpose('M3)) // => ['E', 'F#', 'G#', 'A', 'B']
 */
export function transpose(note, interval) {
  if (arguments.length === 1) return i => transpose(note, i);
  var n = asPitch(note);
  var i = asPitch(interval);
  return n && i ? strPitch(trBy(i, n)) : null;
}

/**
 * The same as transpose with the arguments inverted.
 * 
 * Can be partially applied.
 * 
 * @param {String} note
 * @param {String} interval
 * @return {String} the transposed note
 * @example
 * import { tranposeBy } from 'tonal-distance'
 * transposeBy('3m', '5P') // => '7m'
 */
export function transposeBy(interval, note) {
  if (arguments.length === 1) return n => transposeBy(interval, n);
  return transpose(note, interval);
}

/**
 * Add two intervals 
 * 
 * Can be partially applied.
 * 
 * @param {String} interval1
 * @param {String} interval2
 * @return {String} the resulting interval
 * @example
 * import { add } from 'tonal-distance'
 * add('3m', '5P') // => '7m'
 */
export function add(ivl1, ivl2) {
  if (arguments.length === 1) return i2 => transposeBy(ivl1, i2);
  var p1 = asPitch(ivl1);
  var p2 = asPitch(ivl2);
  return p1 && p2 ? strPitch(trBy(p1, p2)) : null;
}

/**
 * Transpose a note by a number of perfect fifths. 
 * 
 * It can be partially applied.
 *
 * @function
 * @param {String} note
 * @param {Integer} times - the number of times
 * @return {String} the transposed note
 * @example
 * import { trFifths } from 'tonal-transpose'
 * [0, 1, 2, 3, 4].map(trFifths('C')) // => ['C', 'G', 'D', 'A', 'E']
 * // or using tonal
 * tonal.trFifths('G4', 1) // => 'D5'
 */
export function trFifths(t, n) {
  if (arguments.length > 1) return trFifths(t)(n);
  return function(n) {
    return transpose(t, pitch(n, 0, 1));
  };
}

// substract two pitches
function substr(a, b) {
  if (!a || !b || a[1].length !== b[1].length) return null;
  var f = fifths(b) - fifths(a);
  if (isPC(a)) return pitch(f, -Math.floor(f * 7 / 12), 1);
  var o = focts(b) - focts(a);
  var d = height(b) - height(a) < 0 ? -1 : 1;
  return pitch(d * f, d * o, d);
}

/**
 * Find the interval between two pitches. It works with pitch classes 
 * (both must be pitch classes and the interval is always ascending)
 * 
 * Can be partially applied
 *
 * @param {String} from - distance from
 * @param {String} to - distance to
 * @return {String} the interval distance
 *
 * @example
 * import { interval } from 'tonal-distance'
 * interval('C2', 'C3') // => 'P8'
 * interval('G', 'B') // => 'M3'
 * 
 * // or use tonal
 * var tonal = require('tonal')
 * tonal.distance.interval('M2', 'P5') // => 'P4'
 */
export function interval(from, to) {
  if (arguments.length === 1) return to => interval(from, to);
  var pa = asPitch(from);
  var pb = asPitch(to);
  var i = substr(pa, pb);
  // if a and b are in array notation, no conversion back
  return strIvl(i);
}

/**
 * Subtract two intervals
 * 
 * @param {String} minuend
 * @param {String} subtrahend
 * @return {String} interval diference
 */
export function subtract(ivl1, ivl2) {
  return interval(ivl2, ivl1);
}

/**
 * Get the distance between two notes in semitones
 * @param {String|Pitch} from - first note
 * @param {String|Pitch} to - last note
 * @return {Integer} the distance in semitones or null if not valid notes
 * @example
 * import { semitones } from 'tonal-distance'
 * semitones('C3', 'A2') // => -3
 * // or use tonal
 * tonal.distance.semitones('C3', 'G3') // => 7
 */
export function semitones(a, b) {
  var i = substr(asPitch(a), asPitch(b));
  return i ? height(i) : null;
}
