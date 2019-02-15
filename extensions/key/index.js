/**
 * [![npm version](https://img.shields.io/npm/v/tonal-key.svg?style=flat-square)](https://www.npmjs.com/package/tonal-key)
 * [![tonal](https://img.shields.io/badge/tonal-key-yellow.svg?style=flat-square)](https://www.npmjs.com/browse/keyword/tonal)
 *
 * `tonal-key` is a collection of functions to query about tonal keys.
 *
 * This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.
 *
 * @example
 * // es6
 * import * as Key from "tonal-key"
 * // es5
 * const Key = require("tonal-key")
 *
 * @example
 * Key.scale("E mixolydian") // => [ "E", "F#", "G#", "A", "B", "C#", "D" ]
 * Key.relative("minor", "C major") // => "A minor"
 *
 * @module Key
 */
import { rotate, range } from "tonal-array";
import { tokenize as split, altToAcc } from "tonal-note";
import { trFifths, fifths, interval, transpose } from "tonal-distance";
import { fromDegree, decimal } from "tonal-roman-numeral";

const MODES = "major dorian phrygian lydian mixolydian minor locrian ionian aeolian".split(
  " "
);
const NUMS = [0, 1, 2, 3, 4, 5, 6, 0, 5];
const NOTES = "C D E F G A B".split(" ");

const TRIADS = ["", "m", "m", "", "", "m", "dim"];
const SEVENTHS = "Maj7 m7 m7 Maj7 7 m7 m7b5".split(" ");
const FIFTHS = [0, 2, 4, -1, 1, 3, 5, 0, 3];

const modenum = mode => NUMS[MODES.indexOf(mode)];

/**
 * Get a list of valid mode names. The list of modes will be always in
 * increasing order (ionian to locrian)
 *
 * @function
 * @param {Boolean} alias - true to get aliases names
 * @return {Array} an array of strings
 * @example
 * Key.modes() // => [ "ionian", "dorian", "phrygian", "lydian",
 * // "mixolydian", "aeolian", "locrian" ]
 * Key.modes(true) // => [ "ionian", "dorian", "phrygian", "lydian",
 * // "mixolydian", "aeolian", "locrian", "major", "minor" ]
 */
export const modeNames = aliases =>
  aliases === true ? MODES.slice() : MODES.slice(0, 7);

/**
 * Create a major key from alterations
 *
 * @function
 * @param {Integer} alt - the alteration number (positive sharps, negative flats)
 * @return {Key} the key object
 * @example
 * Key.fromAlter(2) // => "D major"
 */
export const fromAlter = i => trFifths("C", i) + " major";

export const names = (alt = 4) => {
  alt = Math.abs(alt);
  const result = [];
  for (let i = -alt; i <= alt; i++) result.push(fromAlter(i));
  return result;
};

const NO_KEY = Object.freeze({
  name: null,
  tonic: null,
  mode: null,
  modenum: null,
  intervals: [],
  scale: [],
  alt: null,
  acc: null
});

const properties = name => {
  const p = tokenize(name);
  if (p[0] === null) return NO_KEY;
  const k = { tonic: p[0], mode: p[1] };
  k.name = k.tonic + " " + k.mode;
  k.modenum = modenum(k.mode);
  const cs = rotate(k.modenum, NOTES);
  k.alt = fifths("C", k.tonic) - FIFTHS[MODES.indexOf(k.mode)];
  k.acc = altToAcc(k.alt);
  k.intervals = cs.map(interval(cs[0]));
  k.scale = k.intervals.map(transpose(k.tonic));
  return Object.freeze(k);
};

const memo = (fn, cache = {}) => str => cache[str] || (cache[str] = fn(str));

/**
 * Return the a key properties object with the following information:
 *
 * - name {string}: name
 * - tonic {string}: key tonic
 * - mode {string}: key mode
 * - modenum {Number}: mode number (0 major, 1 dorian, ...)
 * - intervals {Array}: the scale intervals
 * - scale {Array}: the scale notes
 * - acc {string}: accidentals of the key signature
 * - alt {Number}: alteration number (a numeric representation of accidentals)
 *
 * @function
 * @param {string} name - the key name
 * @return {Object} the key properties object or null if not a valid key
 *
 * @example
 * Key.props("C3 dorian") // => { tonic: "C", mode: "dorian", ... }
 */
export const props = memo(properties);

/**
 * Get scale of a key
 *
 * @function
 * @param {string|Object} key
 * @return {Array} the key scale
 *
 * @example
 * Key.scale("A major") // => [ "A", "B", "C#", "D", "E", "F#", "G#" ]
 * Key.scale("Bb minor") // => [ "Bb", "C", "Db", "Eb", "F", "Gb", "Ab" ]
 * Key.scale("C dorian") // => [ "C", "D", "Eb", "F", "G", "A", "Bb" ]
 * Key.scale("E mixolydian") // => [ "E", "F#", "G#", "A", "B", "C#", "D" ]
 */
export const scale = str => props(str).scale;

/**
 * Get a list of key scale degrees in roman numerals
 * @param {string} keyName
 * @return {Array}
 * @example
 * Key.degrees("C major") => ["I", "ii", "iii", "IV", "V", "vi", "vii"]
 */
export const degrees = str => {
  const p = props(str);
  if (p.name === null) return [];
  const chords = rotate(p.modenum, SEVENTHS);
  return chords.map((chord, i) => {
    return fromDegree(i + 1, chord[0] !== "m");
  });
};

/**
 * Get a list of the altered notes of a given Key. The notes will be in
 * the same order than in the key signature.
 *
 * @function
 * @param {string} key - the key name
 * @return {Array}
 *
 * @example
 * Key.alteredNotes("Eb major") // => [ "Bb", "Eb", "Ab" ]
 */
export const alteredNotes = name => {
  const alt = props(name).alt;
  if (alt === null) return null;
  return alt === 0
    ? []
    : alt > 0
      ? range(1, alt).map(trFifths("B"))
      : range(-1, alt).map(trFifths("F"));
};

/**
 * Get a lead-sheet symbols for a given key name
 *
 * This function is currified (so can be partially applied)
 *
 * From http://openmusictheory.com/triads.html
 *
 * A lead-sheet symbol begins with a capital letter (and, if necessary,
 * an accidental) denoting the root of the chord.
 * That letter is followed by information about a chord’s quality:
 *
 * - major triad: no quality symbol is added
 * - minor triad: lower-case “m”
 * - diminished triad: lower-case “dim” or a degree sign “°”
 * - augmented triad: lower-case “aug” or a plus sign “+”
 *
 * @param {Array<string>} symbols - an array of symbols in major scale order
 * @param {string} keyName - the name of the key you want the symbols for
 * @param {Array<string>} [degrees] - the list of degrees. By default from 1 to 7 in ascending order
 * @return {function}
 * @see Key.chords
 * @see Key.triads
 *
 * @example
 * const chords = Key.leadsheetSymbols(["M", "m", "m", "M", "7", "m", "dim"])
 * chords("D dorian") //=> ["Dm", "Em", "FM", "G7", "Am", "Bdim", "CM"]
 * chords("D dorian", ['ii', 'V']) //=> [Em", "G7"]
 */
export function leadsheetSymbols(symbols, keyName, degrees) {
  if (arguments.length === 1) return (n, d) => leadsheetSymbols(symbols, n, d);
  const p = props(keyName);
  if (!p.name) return [];
  const names = rotate(p.modenum, symbols);
  const chords = p.scale.map((tonic, i) => tonic + names[i]);
  if (!degrees) return chords;
  return degrees.map(decimal).map(n => chords[n - 1]);
}

/**
 * Get key seventh chords
 *
 * @function
 * @param {string} name - the key name
 * @param {Array<number|string>} [degrees] - can be numbers or roman numerals
 * @return {Array<string>} seventh chord names
 *
 * @example
 * Key.chords("A major") // => ["AMaj7", "Bm7", "C#m7", "DMaj7", ..,]
 * Key.chords("A major", ['I', 'IV', 'V']) // => ["AMaj7", "DMaj7", "E7"]
 * Key.chords("A major", [5, 4, 1]) // => ["E7", "DMaj7", AMaj7"]
 */
export const chords = leadsheetSymbols(SEVENTHS);

/**
 * Get key triads
 *
 * @function
 * @param {string} name - the key name
 * @param {Array<string|number>} [degrees]
 * @return {Array<string>} triad names
 *
 * @example
 * Key.triads("A major") // => ["AM", "Bm", "C#m", "DM", "E7", "F#m", "G#mb5"]
 * Key.triads("A major", ['I', 'IV', 'V']) // => ["AMaj7", "DMaj7", "E7"]
 * Key.triads("A major", [1, 4, 5]) // => ["AMaj7", "DMaj7", "E7"]
 */
export const triads = leadsheetSymbols(TRIADS);

/**
 * Get secondary dominant key chords
 *
 * @function
 * @param {string} name - the key name
 * @return {Array}
 *
 * @example
 * Key.secDomChords("A major") // => ["E7", "F#7", ...]
 */

export const secDomChords = name => {
  const p = props(name);
  if (!p.name) return [];
  return p.scale.map(t => transpose(t, "P5") + "7");
};

/**
 * Get relative of a key. Two keys are relative when the have the same
 * key signature (for example C major and A minor)
 *
 * It can be partially applied.
 *
 * @function
 * @param {string} mode - the relative destination
 * @param {string} key - the key source
 *
 * @example
 * Key.relative("dorian", "B major") // => "C# dorian"
 * // partial application
 * var minor = Key.relative("minor")
 * minor("C major") // => "A minor"
 * minor("E major") // => "C# minor"
 */
export const relative = (mode, key) => {
  if (arguments.length === 1) return key => relative(mode, key);
  const num = modenum(mode.toLowerCase());
  if (num === undefined) return null;
  const k = props(key);
  if (k.name === null) return null;
  return trFifths(k.tonic, FIFTHS[num] - FIFTHS[k.modenum]) + " " + mode;
};

/**
 * Split the key name into its components (pitch class tonic and mode name)
 *
 * @function
 * @param {string} name
 * @return {Array} an array in the form [tonic, key]
 *
 * @example
 * Key.tokenize("C major") // => ["C", "major"]
 */
export const tokenize = name => {
  const p = split(name);
  p[3] = p[3].toLowerCase();
  if (p[0] === "" || MODES.indexOf(p[3]) === -1) return [null, null];
  return [p[0] + p[1], p[3]];
};
