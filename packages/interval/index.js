/**
 * [![npm version](https://img.shields.io/npm/v/tonal-interval.svg)](https://www.npmjs.com/package/tonal-interval)
 * [![tonal](https://img.shields.io/badge/tonal-interval-yellow.svg)](https://www.npmjs.com/browse/keyword/tonal)
 *
 * `tonal-interval` is a collection of functions to create and manipulate music intervals.
 *
 * The intervals are strings in shorthand notation. Two variations are supported:
 *
 * - standard shorthand notation: type and number, for example: 'M3', 'd-4'
 * - inverse shorthand notation: number and then type, for example: '3M', '-4d'
 *
 * The problem with the standard shorthand notation is that some strings can be
 * parsed as notes or intervals, for example: 'A4' can be note A in 4th octave
 * or an augmented four. To remove ambiguity, the prefered notation in tonal is the
 * inverse shortand notation.
 *
 * This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.
 *
 * ## Usage
 *
 * ```js
 * import * as interval from 'tonal-interval'
 * // or const interval = require('tonal-interval')
 * interval.semitones('4P') // => 5
 * interval.invert('3m') // => '6M'
 * interval.simplify('9m') // => '2m'
 * ```
 *
 * ## Install
 *
 * [![npm install tonal-interval](https://nodei.co/npm/tonal-interval.png?mini=true)](https://npmjs.org/package/tonal-interval/)
 *
 * ## API Documentation
 *
 * @module interval
 */
// shorthand tonal notation (with quality after number)
const IVL_TNL = "([-+]?\\d+)(d{1,4}|m|M|P|A{1,4})";
// standard shorthand notation (with quality before number)
const IVL_STR = "(AA|A|P|M|m|d|dd)([-+]?\\d+)";
const REGEX = new RegExp("^" + IVL_TNL + "|" + IVL_STR + "$");
const SIZES = [0, 2, 4, 5, 7, 9, 11];
const TYPES = "PMMPPMM";
const CLASSES = [0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1];

export const tokenize = str => {
  const m = REGEX.exec(str);
  return m === null ? null : m[1] ? [m[1], m[2]] : [m[4], m[3]];
};

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
  chroma: null,
  ic: null
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

const properties = str => {
  const t = tokenize(str);
  if (t === null) return NO_IVL;
  const p = { num: +t[0], q: t[1] };
  p.step = (Math.abs(p.num) - 1) % 7;
  p.type = TYPES[p.step];
  if (p.type === "M" && p.q === "P") return NO_IVL;

  p.name = "" + p.num + p.q;
  p.dir = p.num < 0 ? -1 : 1;
  p.simple = p.num === 8 || p.num === -8 ? p.num : p.dir * (p.step + 1);
  p.alt = qToAlt(p.type, p.q);
  p.oct = Math.floor((Math.abs(p.num) - 1) / 7);
  p.semitones = p.dir * (SIZES[p.step] + p.alt + 12 * p.oct);
  p.chroma = ((p.dir * (SIZES[p.step] + p.alt)) % 12 + 12) % 12;
  p.ic = CLASSES[p.chroma];
  return Object.freeze(p);
};

const cache = {};
export function props(str) {
  if (typeof str !== "string") return NO_IVL;
  return cache[str] === undefined ? (cache[str] = properties(str)) : cache[str];
}

export const num = str => props(str).num;
export const name = str => props(str).name;
export const type = str => props(str).type;
export const semitones = str => props(str).semitones;
export const chroma = str => props(str).chroma;
export const ic = str => props(str).ic;

export const build = ({ step, alt, oct, dir } = {}) => {
  if (step === undefined) return null;
  const d = dir < 0 ? "-" : "";
  const num = step + 1 + 7 * oct;
  const type = TYPES[step];
  return d + num + altToQ(type, alt);
};

export const simplify = str => {
  const p = props(str);
  if (p === NO_IVL) return null;
  return p.simple + p.q;
};

export const invert = str => {
  const p = props(str);
  if (p === NO_IVL) return null;
  const step = (7 - p.step) % 7;
  const alt = p.type === "P" ? -p.alt : -(p.alt + 1);
  return build({ step, alt, oct: p.oct, dir: p.dir });
};

// interval numbers
var IN = [1, 2, 2, 3, 3, 4, 5, 5, 6, 6, 7, 7];
// interval qualities
var IQ = "P m M m M P d P m M m M".split(" ");

/**
 * Get interval name from semitones number. Since there are several interval
 * names for the same number, the name it's arbitraty, but deterministic.
 * @param {Integer} num - the number of semitones (can be negative)
 * @return {String} the interval name
 * @example
 * import { fromSemitones } from 'tonal-interval'
 * fromSemitones(7) // => '5P'
 * // or using tonal
 * tonal.fromSemitones(-7) // => '-5P'
 */
export const fromSemitones = num => {
  var d = num < 0 ? -1 : 1;
  var n = Math.abs(num);
  var c = n % 12;
  var o = Math.floor(n / 12);
  return d * (IN[c] + 7 * o) + IQ[c];
};
