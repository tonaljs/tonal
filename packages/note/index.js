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
 * // or const note = require('tonal-note')
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

const REGEX = /^([a-gA-G])(#{1,}|b{1,}|x{1,}|)(-?\d*)\s*(.*)\s*$/;

export function tokenize(str) {
  const m = REGEX.exec(str);
  if (!m) return null;
  return [m[1].toUpperCase(), m[2].replace(/x/g, "##"), m[3], m[4]];
}

const NO_NOTE = Object.freeze({
  pc: null,
  name: null,
  step: null,
  alt: null,
  oct: null,
  chroma: null,
  midi: null
});

const SEMI = [0, 2, 4, 5, 7, 9, 11];
const properties = str => {
  const tokens = tokenize(str);
  if (tokens === null || tokens[3] !== "") return NO_NOTE;
  const [letter, acc, oct] = tokens;
  const p = { letter, acc };
  p.pc = p.letter + p.acc;
  p.name = p.pc + oct;
  p.step = (p.letter.charCodeAt(0) + 3) % 7;
  p.alt = p.acc[0] === "b" ? -p.acc.length : p.acc.length;
  p.oct = oct.length ? +oct : null;
  p.chroma = (SEMI[p.step] + p.alt + 120) % 12;
  p.midi = p.oct !== null ? SEMI[p.step] + p.alt + 12 * (p.oct + 1) : null;
  return Object.freeze(p);
};

const cache = {};
export function props(str) {
  if (typeof str !== "string") return NO_NOTE;
  return cache[str] === undefined ? (cache[str] = properties(str)) : cache[str];
}

/**
 * Test if the given string is a note
 * @param {String} name 
 * @return {boolean}
 */
export const isNote = str => props(str) !== NO_NOTE;

/**
 * Given a note name, return the note name or null if not valid note.
 * The note name will ALWAYS have the letter in upercase and accidentals
 * using # or b
 * 
 * Can be used to test if a string is a valid note name.
 *
 * @function
 * @param {Pitch|string}
 * @return {string}
 *
 * @example
 * const note = require('tonal-note')
 * note.name('cb2') // => 'Cb2'
 * ['c', 'db3', '2', 'g+', 'gx4'].map(note.name) // => ['C', 'Db3', null, null, 'G##4']
 */
export const name = str => props(str).name;

/**
 * Get pitch class of a note. The note can be a string or a pitch array.
 *
 * @function
 * @param {string|Pitch}
 * @return {string} the pitch class
 * @example
 * tonal.pc('Db3') // => 'Db'
 * tonal.map(tonal.pc, 'db3 bb6 fx2') // => [ 'Db', 'Bb', 'F##']
 */
export const pc = str => props(str).pc;

/**
 * Get the note midi number
 * (an alias of tonal-midi `toMidi` function)
 *
 * @function
 * @param {string|Number} note - the note to get the midi number from
 * @return {Integer} the midi number or null if not valid pitch
 * @example
 * note.midi('C4') // => 60
 * note.midi(60) // => 60
 * @see midi.toMidi
 */
export const midi = note => props(note).midi || +note || null;

export const midiToFreq = midi =>
  typeof midi === "number" ? Math.pow(2, (midi - 69) / 12) * 440 : null;

/**
 * Get the frequency of a note
 *
 * @function
 * @param {string|Number} note - the note name or midi note number
 * @return {Number} the frequency
 * @example
 * note.freq('A4') // => 440
 * note.freq(69) // => 440
 */
export const freq = note => midiToFreq(props(note).midi) || midiToFreq(note);

const L2 = Math.log(2);
const L440 = Math.log(440);
/**
 * Get the midi number from a frequency in hertz. The midi number can
 * contain decimals (with two digits precission)
 * 
 * @param {Number} frequency
 * @return {Number}
 * @example
 * note.freqToMidi(220)); //=> 57;
 * note.freqToMidi(261.62)); //=> 60;
 * note.freqToMidi(261)); //=> 59.96;
 */
export const freqToMidi = freq => {
  const v = 12 * (Math.log(freq) - L440) / L2 + 69;
  return Math.round(v * 100) / 100;
};

/**
 * Return the chroma of a note. The chroma is the numeric equivalent to the
 * pitch class, where 0 is C, 1 is C# or Db, 2 is D... 11 is B
 *
 * @param {string} note - the note name
 * @return {Integer} the chroma number
 * @example
 * const note = require('tonal-note')
 * note.chroma('Cb') // => 11
 * ['C', 'D', 'E', 'F'].map(note.chroma) // => [0, 2, 4, 5]
 */
export const chroma = str => props(str).chroma;

/**
 * Get the octave of the given pitch
 *
 * @function
 * @param {string} note - the note
 * @return {Integer} the octave or null if doesn't have an octave or not a valid note
 * @example
 * note.oct('C#4') // => 4
 * note.oct('C') // => null
 * note.oct('blah') // => undefined
 */
export const oct = str => props(str).oct;

/**
 * Get the note step: a number equivalent of the note letter. 0 means C and
 * 6 means B. This is different from `chroma` (see example)
 *
 * @function
 * @param {string} note - the note
 * @return {Integer} a number between 0 and 6 or null if not a note
 * @example
 * note.step('C') // => 0
 * note.step('Cb') // => 0
 * // usually what you need is chroma
 * note.chroma('Cb') // => 6
 */
export const step = str => props(str).step;

/**
 * Get the note alteration: a number equivalent to the accidentals. 0 means
 * no accidentals, negative numbers are for flats, positive for sharps
 *
 * @function
 * @param {string|Pitch} note - the note
 * @return {Integer} the alteration
 * @example
 * note.alt('C') // => 0
 * note.alt('C#') // => 1
 * note.alt('Cb') // => -1
 */
export const alt = str => props(str).alt;

const LETTERS = "CDEFGAB";
/**
 * Given a step number return it's letter (0 = C, 1 = D, 2 = E)
 * @param {number} step 
 * @return {string} the letter
 * @example
 * note.stepToLetter(3) // => "F"
 */
export const stepToLetter = step => LETTERS[step];

const fillStr = (s, n) => Array(n + 1).join(s);
const numToStr = (num, op) => (typeof num !== "number" ? "" : op(num));

/**
 * Given an alteration number, return the accidentals
 * @param {Number} alt 
 * @return {String}
 * @example
 * note.altToAcc(-3) // => 'bbb'
 */
export const altToAcc = alt =>
  numToStr(alt, alt => (alt < 0 ? fillStr("b", -alt) : fillStr("#", alt)));

export const build = ({ step, alt, oct }) => {
  const pc = stepToLetter(step) + altToAcc(alt);
  return oct === undefined ? pc : pc + oct;
};

const FLATS = "C Db D Eb E F Gb G Ab A Bb B".split(" ");
const SHARPS = "C C# D D# E F F# G G# A A# B".split(" ");

/**
 * Given a midi number, returns a note name. The altered notes will have
 * flats unless explicitly set with the optional `useSharps` parameter.
 *
 * @function
 * @param {number} midi - the midi note number
 * @param [boolean] useSharps - (Optional) set to true to use sharps instead of flats
 * @return {string} the note name
 * @example
 * const note = require('tonal-note')
 * note.fromMidi(61) // => 'Db4'
 * note.fromMidi(61, true) // => 'C#4'
 * // it rounds to nearest note
 * note.fromMidi(61.7) // => 'D4'
 */
export function fromMidi(num, sharps) {
  num = Math.round(num);
  const pcs = sharps === true ? SHARPS : FLATS;
  const pc = pcs[num % 12];
  const o = Math.floor(num / 12) - 1;
  return pc + o;
}
