/**
 * [![npm version](https://img.shields.io/npm/v/tonal-roman-numeral.svg?style=flat-square)](https://www.npmjs.com/package/tonal-roman-numeral)
 * [![tonal](https://img.shields.io/badge/tonal-roman-numeral-yellow.svg?style=flat-square)](https://www.npmjs.com/browse/keyword/tonal)
 *
 * `tonal-roman-numeral` is a collection of functions to query about tonal keys.
 *
 * This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.
 *
 * @example
 * // es6
 * import * as RomanNumeral from "tonal-roman-numeral"
 * // es5
 * const RomanNumeral = require("tonal-roman-numeral")
 *
 * @example
 * RomanNumeral.names() // => ["I", "II", "III", "IV", "V", "VI", "VII"]
 * RomanNumeral.props('ii7') // => { name: 'ii', type: '7', num: 2, major: false }
 * RomanNumeral.degree(2) // => "II"
 * RomanNumeral.degree(2, false) // => "ii"
 * @module RomanNumeral
 */

const NAMES = "I II III IV V VI VII".split(" ");
const NAMES_MINOR = NAMES.map(n => n.toLowerCase());
const REGEX = /^(IV|I{1,3}|VI{0,2}|iv|i{1,3}|vi{0,2})([^IViv]*)$/;
const NO_PROPS = { name: null, type: null };

const getNames = major => (major === false ? NAMES_MINOR : NAMES);
const memo = (fn, cache = {}) => str => cache[str] || (cache[str] = fn(str));

const properties = str => {
  const m = REGEX.exec(str);
  if (!m) return NO_PROPS;
  const name = m[1];
  const type = m[2];
  const n = name.toUpperCase();
  const major = name === n;
  const decimal = NAMES.indexOf(n) + 1;
  return { name, type, decimal, major };
};

/**
 * Get properties of a roman numeral string
 *
 * @function
 * @param {string} - the roman numeral string (can have type, like: Imaj7)
 * @return {Object} - the roman numeral properties
 *
 * @example
 * props("VIIb5") // => { name: "VII", type: "b5", num: 7, major: true }
 */
export const props = memo(properties);

/**
 * Get roman numeral names
 *
 * @function
 * @param {boolean} [isMajor=true]
 * @return {Array<String>}
 *
 * @example
 * names() // => ["I", "II", "III", "IV", "V", "VI", "VII"]
 * names(false) // => ["i", "ii", "iii", "iv", "v", "vi", "vii"]
 */
export const names = isMajor => getNames(isMajor).slice();

/**
 * Get roman numeral name of a string or null if not valid roman numeral
 *
 * @function
 * @param {string} name
 * @return {string}
 *
 * @example
 * name('IIb7') // => 'II
 * name('iii') // => 'iii'
 * name('Ii') // => null (mixed case not allowed)
 */
export const name = str => props(str).name;

/**
 * Get type of a roman numeral
 *
 * @function
 * @param {string} name
 * @return {string}
 *
 * @example
 * type('Imaj7') // => 'maj7'
 */
export const type = str => props(str).type;

/**
 * Get roman numeral number in decimal integer (it accepts numbers from 1 to 7)
 *
 *
 * @function
 * @param {string|number} name - roman numeral name (with optional type)
 * @return {number}
 *
 * @example
 * decimal('IVmaj7') // => 4
 * decimal(4) // => 4
 * decimal(10) // => null
 */
export const decimal = val =>
  val > 0 && val < 8 ? val : props(val).decimal || null;

/**
 * Get a roman numeral from a degree number
 *
 * @function
 * @param {number} degree
 * @param {boolean} [isMajor=true]
 * @return {string} the roman numeral
 *
 * @example
 * fromDegree(2) // => "II"
 * fromDegree(2, false) // => "ii"
 */
export const fromDegree = (degree, isMajor) =>
  getNames(isMajor)[degree - 1] || null;
