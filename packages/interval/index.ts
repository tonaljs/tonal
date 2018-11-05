export type Interval = string;
type IntervalProps = {
  name: Interval;
  num: number;
  q: string; // interval quality. One of: "dddd" | "ddd" | "dd" | "d" | "m" | "M" | "P" | "A" | "AA" | "AAA" | "AAAA";
  step: number;
  alt: number;
  dir: number; // -1 or 1
  type: string; // "P" or "M"
  simple: number; // the simplified number
  semitones: number; // the number of semitiones
  chroma: number; // the chroma (the number of semitones of the simplified interval, except 8P)
  oct: number; // the number of octaves
};

type NoIntervalProps = {
  name: null;
  num: null;
  q: null;
  step: null;
  alt: null;
  dir: null;
  type: null;
  simple: null;
  semitones: null;
  chroma: null;
  oct: null;
};
export type Properties = Readonly<IntervalProps> | Readonly<NoIntervalProps>;
/**
 * [![npm version](https://img.shields.io/npm/v/tonal-interval.svg)](https://www.npmjs.com/package/tonal-interval)
 * [![tonal](https://img.shields.io/badge/tonal-interval-yellow.svg)](https://www.npmjs.com/browse/keyword/tonal)
 *
 * `tonal-interval` is a collection of functions to create and manipulate music intervals.
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
 * ```js
 * // es6
 * import * as Interval from "tonal-interval"
 * // es5
 * const Interval = require("tonal-interval")
 * // part of tonal
 * import { Interval } from "tonal"
 *
 * Interval.semitones("4P") // => 5
 * Interval.invert("3m") // => "6M"
 * Interval.simplify("9m") // => "2m"
 * ```
 *
 * ## Install
 *
 * [![npm install tonal-interval](https://nodei.co/npm/tonal-interval.png?mini=true)](https://npmjs.org/package/tonal-interval/)
 *
 * ## API Documentation
 *
 * @module Interval
 */

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
export function names(types?: string) {
  return typeof types !== "string"
    ? NAMES.slice()
    : NAMES.filter(n => types.indexOf(n[1]) !== -1);
}

// FIXME: Note.tokenize always return an array... this should be the same
export function tokenize(str?: string): [string, string] | null {
  const m = REGEX.exec(`${str}`) as string[];
  if (m === null) return null;
  return m[1] ? [m[1], m[2]] : [m[4], m[3]];
}

const NO_IVL: Readonly<NoIntervalProps> = Object.freeze({
  name: null,
  num: null,
  q: null,
  step: null,
  alt: null,
  dir: null,
  type: null,
  simple: null,
  semitones: null,
  chroma: null,
  oct: null
});

const fillStr = (s: string, n: number) => Array(Math.abs(n) + 1).join(s);

// export for tests only
export const qToAlt = (type: string, q: string) => {
  if (q === "M" && type === "M") return 0;
  if (q === "P" && type === "P") return 0;
  if (q === "m" && type === "M") return -1;
  if (/^A+$/.test(q)) return q.length;
  if (/^d+$/.test(q)) return type === "P" ? -q.length : -q.length - 1;
  return null;
};
// export for tests only
export const altToQ = (type: string, alt: number) => {
  if (alt === 0) return type === "M" ? "M" : "P";
  else if (alt === -1 && type === "M") return "m";
  else if (alt > 0) return fillStr("A", alt);
  else if (alt < 0) return fillStr("d", type === "P" ? alt : alt + 1);
  else return null;
};

const numToStep = (num: number): number => (Math.abs(num) - 1) % 7;

function parse(str?: string): Properties {
  const t = tokenize(str);
  if (t === null) return NO_IVL;
  const num = +t[0];
  const q = t[1];
  const step = numToStep(num);
  const type = TYPES[step];
  if (type === "M" && q === "P") return NO_IVL;

  const name = "" + num + q;
  const dir = num < 0 ? -1 : 1;
  const simple = num === 8 || num === -8 ? num : dir * (step + 1);
  const alt = qToAlt(type, q) as number;
  const oct = Math.floor((Math.abs(num) - 1) / 7);
  const semitones = dir * (SIZES[step] + alt + 12 * oct);
  const chroma = (((dir * (SIZES[step] + alt)) % 12) + 12) % 12;
  return Object.freeze({
    num,
    q,
    step,
    type,
    name,
    dir,
    simple,
    alt,
    oct,
    semitones,
    chroma
  });
}

const cache = {} as { [key: string]: Properties };
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
 * @return {object} the interval in the form [number, alt]
 */
export function props(str: Interval): Properties {
  if (typeof str !== "string") return NO_IVL;
  return cache[str] || (cache[str] = parse(str));
}

/**
 * Get the number of the interval
 *
 * @param {string} interval - the interval
 * @return {number}
 * @example
 * Interval.num("m2") // => 2
 * Interval.num("P9") // => 9
 * Interval.num("P-4") // => -4
 */
export function num(str: Interval): number | null {
  return props(str).num;
}

/**
 * Get interval name. Can be used to test if it"s an interval. It accepts intervals
 * as pitch or string in shorthand notation or tonal notation. It returns always
 * intervals in tonal notation.
 *
 * @param {string} interval - the interval string or array
 * @return {string} the interval name or null if not valid interval
 * @example
 * Interval.name("m-3") // => "-3m"
 * Interval.name("3") // => null
 */
export function name(str: Interval): string | null {
  return props(str).name;
}

/**
 * Get size in semitones of an interval
 *
 * @function
 * @param {string} ivl
 * @return {number} the number of semitones or null if not an interval
 * @example
 * import { semitones } from "tonal-interval"
 * semitones("P4") // => 5
 * // or using tonal
 * Tonal.Interval.semitones("P5") // => 7
 */
export function semitones(str: Interval): number | null {
  return props(str).semitones;
}

/**
 * Get the chroma of the interval. The chroma is a number between 0 and 11
 * that represents the position within an octave (pitch set)
 *
 * @param {string} interval - the interval name
 * @return {number | null} - the chroma (0...11) or null if not valid interval name
 */
export function chroma(str: Interval): number | null {
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
 * @param {string | number} interval - the interval or the number of semitones
 * @return {number | null} A value between 0 and 6
 *
 * @example
 * Interval.ic("P8") // => 0
 * Interval.ic("m6") // => 4
 * Interval.ic(10) // => 2
 * ["P1", "M2", "M3", "P4", "P5", "M6", "M7"].map(ic) // => [0, 2, 4, 5, 5, 3, 1]
 */
export function ic(ivl: Interval | number): number | null {
  const c = props(ivl as Interval).chroma;
  const chroma = c !== null ? c : ivl;
  return typeof chroma === "number" ? CLASSES[chroma % 12] : null;
}

/**
 * Given a interval property object, get the interval name
 *
 * The properties must contain a `num` *or* `step`, and `alt`:
 *
 * - num: the interval number
 * - step: the interval step (overrides the num property)
 * - alt: the interval alteration
 * - oct: (Optional) the number of octaves
 * - dir: (Optional) the direction
 *
 * @param {object} props - the interval property object
 *
 * @return {string} the interval name
 * @example
 * Interval.build({ step: 1, alt: -1, oct: 0, dir: 1 }) // => "1d"
 * Interval.build({ num: 9, alt: -1 }) // => "9m"
 */
export function build(props = {} as Partial<IntervalProps>) {
  let { num, step, alt, oct = 1, dir } = props;
  if (step !== undefined) num = step + 1 + 7 * oct;
  if (num === undefined) return null;
  if (typeof alt !== "number") return null;
  const d = typeof dir !== "number" ? "" : dir < 0 ? "-" : "";
  // const d = dir < 0 ? "-" : "";
  const type = TYPES[numToStep(num)];
  return (d + num + altToQ(type, alt)) as Interval;
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
export function simplify(str: Interval): Interval | null {
  const p = props(str);
  if (p === NO_IVL) return null;
  const ip = p as IntervalProps;
  return ip.simple + ip.q;
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
export function invert(str: Interval): Interval | null {
  const p = props(str);
  if (p === NO_IVL) return null;
  const intervalProps = p as IntervalProps;
  const step = (7 - intervalProps.step) % 7;
  const alt =
    intervalProps.type === "P" ? -intervalProps.alt : -(intervalProps.alt + 1);
  return build({ step, alt, oct: intervalProps.oct, dir: intervalProps.dir });
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
 * @param {number} num - the number of semitones (can be negative)
 * @return {string} the interval name
 * @example
 * import { fromSemitones } from "tonal-interval"
 * fromSemitones(7) // => "5P"
 * // or using tonal
 * Tonal.Distance.fromSemitones(-7) // => "-5P"
 */
export function fromSemitones(num: number): Interval {
  var d = num < 0 ? -1 : 1;
  var n = Math.abs(num);
  var c = n % 12;
  var o = Math.floor(n / 12);
  return d * (IN[c] + 7 * o) + IQ[c];
}
