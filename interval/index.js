/**
 * A collection of functions to create and manipulate music intervals.
 *
 * The intervals are strings in shorthand notation. Two variations are supported:
 *
 * - standard shorthand notation: type and number, for example: "M3", "d-4"
 * - inverse shorthand notation: number and then type, for example: "3M", "-4d"
 *
 * The problem with the standard shorthand notation is that some strings can be
 * parsed as notes or intervals, for example: "A4" can be note A in 4th octave
 * or an augmented four. To remove ambiguity, the prefered notation in tonal is the
 * inverse shortand notation.
 *
 * This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.
 *
 * ## Usage
 *
 * With Es6 modules:
 *
 * ```js
 * import Interval from "tonal/interval"
 * Interval.semitones("4P") // => 5
 * Interval.invert("3m") // => "6M"
 * Interval.simplify("9m") // => "2m"
 * ```
 *
 * ES5 modules:
 *
 * ```js
 * const Tonal = require('tonal')
 * Tonal.Interval.semitones("4P") // => 5
 * ```
 *
 * ## API
 *
 * @module Interval
 */
export default {
  tokenize,
  props,
  simplify,
  invert,
  names,
  num,
  name,
  fromProps,
  chroma,
  ic,
  semitones,
  fromSemitones
};

// shorthand tonal notation (with quality after number)
const IVL_TNL = "([-+]?\\d+)(d{1,4}|m|M|P|A{1,4})";
// standard shorthand notation (with quality before number)
const IVL_STR = "(AA|A|P|M|m|d|dd)([-+]?\\d+)";
const REGEX = new RegExp("^" + IVL_TNL + "|" + IVL_STR + "$");
const SIZES = [0, 2, 4, 5, 7, 9, 11];
const TYPES = "PMMPPMM";
const CLASSES = [0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1];
const NAMES = "1P 2m 2M 3m 3M 4P 5P 6m 6M 7m 7M 8P".split(" ");

/**
 * List basic (perfect, major, minor) interval names within a octave
 * @param {string} qualities - (Optional, default "PMm") the valid types
 * @return {Array} the interval names
 * @example
 * Interval.names() // => [ "1P", "2m", "2M", "3m", "3M", "4P", "5P", "6m", "6M", "7m", "7M", "8P" ]
 * Interval.names("P") // => [ "1P", "4P", "5P", "8P" ]
 * Interval.names("PM") // => [ "1P", "2M", "3M", "4P", "5P", "6M", "7M", "8P" ]
 * Interval.names("Pm") // => [ "1P", "2m", "3m", "4P", "5P", "6m", "7m", "8P" ]
 * Interval.names("d") // => []
 */
export function names(types) {
  return typeof types !== "string"
    ? NAMES.slice()
    : NAMES.filter(n => types.indexOf(n[1]) !== -1);
}

/**
 * Split a interval string into its parts
 *
 * It returns an array with the shape [number, type]
 * @param {string} interval - the interval string
 * @return {Array<String>}
 *
 * @example
 * Interval.tokenize("-2M") //=> ["-2", "M"]
 */
export function tokenize(str) {
  const m = REGEX.exec(str);
  return m === null ? null : m[1] ? [m[1], m[2]] : [m[4], m[3]];
}

const NO_IVL = Object.freeze({
  name: null,
  num: null,
  q: null,
  step: null,
  alt: null,
  dir: null,
  type: null,
  simple: null,
  semitones: null,
  chroma: null
});

const fillStr = (s, n) => Array(Math.abs(n) + 1).join(s);

const qToAlt = (type, q) => {
  if (q === "M" && type === "M") return 0;
  if (q === "P" && type === "P") return 0;
  if (q === "m" && type === "M") return -1;
  if (/^A+$/.test(q)) return q.length;
  if (/^d+$/.test(q)) return type === "P" ? -q.length : -q.length - 1;
  return null;
};

const altToQ = (type, alt) => {
  if (alt === 0) return type === "M" ? "M" : "P";
  else if (alt === -1 && type === "M") return "m";
  else if (alt > 0) return fillStr("A", alt);
  else if (alt < 0) return fillStr("d", type === "P" ? alt : alt + 1);
  else return null;
};

const numToStep = num => (Math.abs(num) - 1) % 7;

const properties = str => {
  const t = tokenize(str);
  if (t === null) return NO_IVL;
  const p = { num: +t[0], q: t[1] };
  p.step = numToStep(p.num);
  p.type = TYPES[p.step];
  if (p.type === "M" && p.q === "P") return NO_IVL;

  p.name = "" + p.num + p.q;
  p.dir = p.num < 0 ? -1 : 1;
  p.simple = p.num === 8 || p.num === -8 ? p.num : p.dir * (p.step + 1);
  p.alt = qToAlt(p.type, p.q);
  p.oct = Math.floor((Math.abs(p.num) - 1) / 7);
  p.semitones = p.dir * (SIZES[p.step] + p.alt + 12 * p.oct);
  p.chroma = (((p.dir * (SIZES[p.step] + p.alt)) % 12) + 12) % 12;
  return Object.freeze(p);
};

const cache = {};
/**
 * Get interval properties. It returns an object with:
 *
 * - name: name
 * - num: number
 * - q: quality
 * - step: step
 * - alt: alteration
 * - dir: direction (1 ascending, -1 descending)
 * - type: "P" or "M" for perfectable or majorable
 * - simple: the simplified number
 * - semitones: the size in semitones
 * - chroma: the interval chroma
 * - ic: the interval class
 *
 * @function
 * @param {string} interval - the interval
 * @return {Object} the interval in the form [number, alt]
 */
export function props(str) {
  if (typeof str !== "string") return NO_IVL;
  return cache[str] || (cache[str] = properties(str));
}

/**
 * Get the number of the interval
 *
 * @function
 * @param {string} interval - the interval
 * @return {Integer}
 * @example
 * Interval.num("m2") // => 2
 * Interval.num("P9") // => 9
 * Interval.num("P-4") // => -4
 */
export function num(str) {
  return props(str).num;
}

/**
 * Get interval name. Can be used to test if it"s an interval. It accepts intervals
 * as pitch or string in shorthand notation or tonal notation. It returns always
 * intervals in tonal notation.
 *
 * @function
 * @param {string} interval - the interval string or array
 * @return {string} the interval name or null if not valid interval
 * @example
 * Interval.name("m-3") // => "-3m"
 * Interval.name("3") // => null
 */
export function name(str) {
  return props(str).name;
}

/**
 * Get size in semitones of an interval
 *
 * @function
 * @param {string} ivl
 * @return {Integer} the number of semitones or null if not an interval
 * @example
 * import { semitones } from "tonal-interval"
 * semitones("P4") // => 5
 * // or using tonal
 * Tonal.Interval.semitones("P5") // => 7
 */
export function semitones(str) {
  return props(str).semitones;
}

/**
 * Get the chroma of the interval. The chroma is a number between 0 and 7
 * that represents the position within an octave (pitch set)
 *
 * @function
 * @param {string} str
 * @return {number}
 */
export function chroma(str) {
  return props(str).chroma;
}

/**
 * Get the [interval class](https://en.wikipedia.org/wiki/Interval_class)
 * number of a given interval.
 *
 * In musical set theory, an interval class is the shortest distance in
 * pitch class space between two unordered pitch classes
 *
 * @function
 * @param {String|Integer} interval - the interval or the number of semitones
 * @return {Integer} A value between 0 and 6
 *
 * @example
 * Interval.ic("P8") // => 0
 * Interval.ic("m6") // => 4
 * Interval.ic(10) // => 2
 * ["P1", "M2", "M3", "P4", "P5", "M6", "M7"].map(ic) // => [0, 2, 4, 5, 5, 3, 1]
 */
export function ic(ivl) {
  if (typeof ivl === "string") ivl = props(ivl).chroma;
  return typeof ivl === "number" ? CLASSES[ivl % 12] : null;
}

/**
 * Given a interval props object, get the interval name
 *
 * The properties must contain a `num` *or* `step`, and `alt`:
 *
 * - num: the interval number
 * - step: the interval step (overrides the num property)
 * - alt: the interval alteration
 * - oct: (Optional) the number of octaves
 * - dir: (Optional) the direction
 *
 * @function
 * @param {Object} props - the interval property object
 *
 * @return {string} the interval name
 * @example
 * Interval.fromProps({ step: 1, alt: -1, oct: 0, dir: 1 }) // => "1d"
 * Interval.fromProps({ num: 9, alt: -1 }) // => "9m"
 */
export function fromProps({ num, step, alt, oct = 1, dir } = {}) {
  if (step !== undefined) num = step + 1 + 7 * oct;
  if (num === undefined) return null;

  const d = dir < 0 ? "-" : "";
  const type = TYPES[numToStep(num)];
  return d + num + altToQ(type, alt);
}

/**
 * Get the simplified version of an interval.
 *
 * @function
 * @param {string} interval - the interval to simplify
 * @return {string} the simplified interval
 *
 * @example
 * Interval.simplify("9M") // => "2M"
 * ["8P", "9M", "10M", "11P", "12P", "13M", "14M", "15P"].map(Interval.simplify)
 * // => [ "8P", "2M", "3M", "4P", "5P", "6M", "7M", "8P" ]
 * Interval.simplify("2M") // => "2M"
 * Interval.simplify("-2M") // => "7m"
 */
export function simplify(str) {
  const p = props(str);
  if (p === NO_IVL) return null;
  return p.simple + p.q;
}

/**
 * Get the inversion (https://en.wikipedia.org/wiki/Inversion_(music)#Intervals)
 * of an interval.
 *
 * @function
 * @param {string} interval - the interval to invert in interval shorthand
 * notation or interval array notation
 * @return {string} the inverted interval
 *
 * @example
 * Interval.invert("3m") // => "6M"
 * Interval.invert("2M") // => "7m"
 */
export function invert(str) {
  const p = props(str);
  if (p === NO_IVL) return null;
  const step = (7 - p.step) % 7;
  const alt = p.type === "P" ? -p.alt : -(p.alt + 1);
  return fromProps({ step, alt, oct: p.oct, dir: p.dir });
}

// interval numbers
var IN = [1, 2, 2, 3, 3, 4, 5, 5, 6, 6, 7, 7];
// interval qualities
var IQ = "P m M m M P d P m M m M".split(" ");

/**
 * Get interval name from semitones number. Since there are several interval
 * names for the same number, the name it"s arbitraty, but deterministic.
 *
 * @function
 * @param {Integer} num - the number of semitones (can be negative)
 * @return {string} the interval name
 * @example
 * import { fromSemitones } from "tonal-interval"
 * fromSemitones(7) // => "5P"
 * // or using tonal
 * Tonal.Distance.fromSemitones(-7) // => "-5P"
 */
export function fromSemitones(num) {
  var d = num < 0 ? -1 : 1;
  var n = Math.abs(num);
  var c = n % 12;
  var o = Math.floor(n / 12);
  return d * (IN[c] + 7 * o) + IQ[c];
}
