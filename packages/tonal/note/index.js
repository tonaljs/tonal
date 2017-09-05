/**
 * [![npm version](https://img.shields.io/npm/v/tonal-note.svg)](https://www.npmjs.com/package/tonal-note)
 * [![tonal](https://img.shields.io/badge/tonal-note-yellow.svg)](https://www.npmjs.com/browse/keyword/tonal)
 *
 * `tonal-note` is a collection of functions to manipulate musical notes in scientific notation
 *
 * This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.
 *
 * ## Usage
 *
 * ```js
 * import * as note from 'tonal-note'
 * // or var note = require('tonal-note')
 * note.name('bb2') // => 'Bb2'
 * note.chroma('bb2') // => 10
 * note.midi('a4') // => 69
 * note.freq('a4') // => 440
 * note.oct('G3') // => 3
 * 
 * // part of tonal
 * const tonal = require('tonal')
 * tonal.note.midi('d4') // => 62
 * ```
 *
 * ## Install
 *
 * [![npm install tonal-note](https://nodei.co/npm/tonal-note.png?mini=true)](https://npmjs.org/package/tonal-note/)
 *
 * ## API Documentation
 *
 * @module note
 */
import { fifths, asNotePitch } from "tonal-pitch";
import { note as midiToNote } from "tonal-midi";

const REGEX = /^([a-gA-G])(#{1,}|b{1,}|x{1,}|)(-?\d*)\s*(.*)\s*$/;

export function split(str) {
  const m = REGEX.exec(str);
  if (!m) return null;
  return {
    letter: m[1].toUpperCase(),
    acc: m[2].replace(/x/g, "##"),
    oct: m[3],
    mod: m[4]
  };
}

function parseNote(str) {
  const p = split(str);
  return p && p.mod === ""
    ? {
        step: (p.letter.charCodeAt(0) + 3) % 7,
        alt: p.acc[0] === "b" ? -p.acc.length : p.acc.length,
        oct: p.oct.length ? +p.oct : null
      }
    : null;
}

var cache = {};
export function parse(name) {
  if (typeof name !== "string") return null;
  return cache[name] === undefined
    ? (cache[name] = parseNote(name))
    : cache[name];
}

const parsed = fn => (str, p) => ((p = parse(str)) !== null ? fn(p) : null);

const SEMI = [0, 2, 4, 5, 7, 9, 11];
const toMidi = parsed(
  p => (p.oct !== null ? SEMI[p.step] + p.alt + 12 * (p.oct + 1) : null)
);
/**
 * Get the note midi number
 * (an alias of tonal-midi `toMidi` function)
 *
 * @function
 * @param {String|Number} note - the note to get the midi number from
 * @return {Integer} the midi number or null if not valid pitch
 * @example
 * note.midi('C4') // => 60
 * note.midi(60) // => 60
 * @see midi.toMidi
 */
export const midi = note => toMidi(note) || +note || null;

/**
 * Get the note name of a given midi note number
 * (an alias of tonal-midi `note` function)
 *
 * @function
 * @param {Integer} midi - the midi note number
 * @param {Boolean} useSharps - (Optional) set to true to use sharps instead of flats
 * @return {String} the note name
 * @example
 * note.fromMidi(60) // => 'C4'
 * @see midi.note
 */
export var fromMidi = midiToNote;

/**
 * Get the frequency of a note
 *
 * @function
 * @param {String|Number} note - the note name or midi note number
 * @return {Number} the frequency
 * @example
 * note.freq('A4') // => 440
 */
export const freq = (str, m) =>
  (m = midi(str)) !== null ? Math.pow(2, (m - 69) / 12) * 440 : null;

/**
 * Return the chroma of a note. The chroma is the numeric equivalent to the
 * pitch class, where 0 is C, 1 is C# or Db, 2 is D... 11 is B
 *
 * @param {String} note - the note name
 * @return {Integer} the chroma number
 * @example
 * var note = require('tonal-note')
 * note.chroma('Cb') // => 11
 * ['C', 'D', 'E', 'F'].map(note.chroma) // => [0, 2, 4, 5]
 */
export const chroma = parsed(p => (SEMI[p.step] + p.alt + 120) % 12);

/**
 * @deprecated
 * An alias for note. Get the name of a note in scientific notation
 * @function
 */
export function note(n) {
  console.warn("note.note() is deprecated. Use note.name()");
  return name(n);
}

/**
 * Get the octave of the given pitch
 *
 * @function
 * @param {String} note - the note
 * @return {Integer} the octave or null if doesn't have an octave or not a valid note
 * @example
 * note.oct('C#4') // => 4
 * note.oct('C') // => null
 * note.oct('blah') // => null
 */
export const oct = parsed(p => p.oct);

/**
 * Get the note step: a number equivalent of the note letter. 0 means C and
 * 6 means B. This is different from `chroma` (see example)
 *
 * @function
 * @param {String} note - the note
 * @return {Integer} a number between 0 and 6 or null if not a note
 * @example
 * note.step('C') // => 0
 * note.step('Cb') // => 0
 * // usually what you need is chroma
 * note.chroma('Cb') // => 6
 */
export const step = parsed(p => p.step);

/**
 * @deprecated
 * Get the note step in fifths from 'C'. One property of the perfect fifth
 * interval is that you can obtain any pitch class by transposing 'C' a
 * number of times. This function return that number.
 * @param {String|Pitch} note - the note (can be a pitch class)
 * @return {Integer} the number of fifths to reach that pitch class from 'C'
 */
export function pcFifths(note) {
  console.warn("Deprecated. Do you really need this?");
  var p = asNotePitch(note);
  return p ? fifths(p) : null;
}

/**
 * Get the note alteration: a number equivalent to the accidentals. 0 means
 * no accidentals, negative numbers are for flats, positive for sharps
 *
 * @function
 * @param {String|Pitch} note - the note
 * @return {Integer} the alteration
 * @example
 * note.alt('C') // => 0
 * note.alt('C#') // => 1
 * note.alt('Cb') // => -1
 */
export const alt = parsed(p => p.alt);

const LETTERS = "CDEFGAB";
/**
 * Given a step number return it's letter (0 = C, 1 = D, 2 = E)
 * @param {number} step 
 * @return {string} the letter
 * @private
 */
const letter = step => LETTERS[step];

const fillStr = (s, n) => Array(n + 1).join(s);
const numToStr = (num, op) => (typeof num !== "number" ? "" : op(num));

const acc = alt =>
  numToStr(alt, alt => (alt < 0 ? fillStr("b", -alt) : fillStr("#", alt)));

/**
 * Build a note name in scientific notation from a parsed note 
 * (an object with { step, alt, oct })
 * @function
 * @param {parsed} parsed
 * @return {string} the note name
 * @example
 * note.build({ step: 1, alt: -1, oct: 3 }) // => Db3
 */
export const build = p => letter(p.step) + acc(p.alt) + numToStr(p.oct, o => o);

/**
 * Given a note name, return the note name or null if not valid note.
 * The note name will ALWAYS have the letter in upercase and accidentals
 * using # or b
 * 
 * Can be used to test if a string is a valid note name.
 *
 * @function
 * @param {Pitch|String}
 * @return {String}
 *
 * @example
 * var note = require('tonal-note')
 * note.name('cb2') // => 'Cb2'
 * ['c', 'db3', '2', 'g+', 'gx4'].map(note.name) // => ['C', 'Db3', null, null, 'G##4']
 */
export const name = parsed(p => build(p));

/**
 * Get pitch class of a note. The note can be a string or a pitch array.
 *
 * @function
 * @param {String|Pitch}
 * @return {String} the pitch class
 * @example
 * tonal.pc('Db3') // => 'Db'
 * tonal.map(tonal.pc, 'db3 bb6 fx2') // => [ 'Db', 'Bb', 'F##']
 */
export const pc = parsed(p => letter(p.step) + acc(p.alt));
