export type OrNull<T> = T | null;
// A PC is a pitch class (letter, accidentals)
// Examples: "C", "Db", "F#"
export type PC = string; // Note letter + accidentals
// A Note is a pitch class with octave (letter, accidentals, octave)
// Examples: C2, Db5, F#4
export type Note = string; // NoteLetter + NoteAccidental + Octave

type NoteProperties = {
  name: Note;
  letter: string; // {string} note letter: "A" | "B" | "C" | "D" | "E" | "F" | "G";
  acc: string; // {string} the note accidentals ("", "#", "bb", ...)
  oct: number | null; // {number} the octave or null if not present
  step: number; // {number} number equivalent of the note letter. 0 means C ... 6 means B.
  pc: PC; // {string}: the pitch class (letter + accidentals)
  alt: number; // {number}: number equivalent of accidentals (zero no accidentals, negative are flats, positive sharps)
  chroma: number; // {number}: number equivalent of the pitch class, where 0 is C, 1 is C# or Db, 2 is D...
  midi: number | null; // {number}: the note midi number (IMPORTANT! it can be outside 0 to 127 range)
  freq: OrNull<number>; // {number}: the frequency using an equal temperament at 440Hz
};

type NoNoteProperties = {
  name: null;
  // letter: null;
  // acc: null; // {string}: the note accidentals
  oct: null; // {number}: the octave or null if not present
  step: null; // {number}: number equivalent of the note letter. 0 means C ... 6 means B.
  pc: null; //{string}: the pitch class (letter + accidentals)
  alt: null; // {number}: number equivalent of accidentals (negative are flats, positive sharps)
  chroma: null; // {number}: number equivalent of the pitch class, where 0 is C, 1 is C# or Db, 2 is D...
  midi: null; // {number}: the note midi number (IMPORTANT! it can be outside 0 to 127 range)
  freq: null;
};

export type Properties = Readonly<NoteProperties> | Readonly<NoNoteProperties>;

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
 * import * as Note from "tonal-note"
 * // or const Note = require("tonal-note")
 * Note.name("bb2") // => "Bb2"
 * Note.chroma("bb2") // => 10
 * Note.midi("a4") // => 69
 * Note.freq("a4") // => 440
 * Note.oct("G3") // => 3
 *
 * // part of tonal
 * const Tonal = require("tonal")
 * // or import Note from "tonal"
 * Tonal.Note.midi("d4") // => 62
 * ```
 *
 * ## Install
 *
 * [![npm install tonal-note](https://nodei.co/npm/tonal-note.png?mini=true)](https://npmjs.org/package/tonal-note/)
 *
 * ## API Documentation
 *
 * @module Note
 */

const NAMES = "C C# Db D D# Eb E F F# Gb G G# Ab A A# Bb B".split(
  " "
) as Note[];

/**
 * Get a list of note names (pitch classes) within a octave
 *
 * FIXME: 2.0 change signature to names({ plain: true, flats: true, sharps: false })
 * @param {string} accTypes - (Optional, by default " b#"). A string with the
 * accidentals types: " " means no accidental, "#" means sharps, "b" mean flats,
 * can be combined (see examples)
 * @return {Array}
 * @example
 * Note.names(" b") // => [ "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B" ]
 * Note.names(" #") // => [ "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B" ]
 */
export function names(accTypes: string | undefined = undefined): Note[] {
  return typeof accTypes !== "string"
    ? NAMES.slice()
    : NAMES.filter(n => {
        const acc = n[1] || " ";
        return accTypes.indexOf(acc) !== -1;
      });
}

const SHARPS: Note[] = names(" #");
const FLATS: Note[] = names(" b");

const TOKENIZE = /^([a-gA-G]?)(#{1,}|b{1,}|x{1,}|)(-?\d*)\s*(.*)$/;

/**
 * Split a string into tokens related to note parts.
 *
 * It always returns an array of strings: `[letter, accidental, octave, modifier]`
 *
 * @param {string} str
 * @return {string[]} an array with 4 strings (letter, accidental, octave, modified)
 *
 * @example
 * Note.tokenize("C#2") // => ["C", "#", "2", ""]
 * Note.tokenize("Db3 major") // => ["D", "b", "3", "major"]
 * Note.tokenize("major") // => ["", "", "", "major"]
 * Note.tokenize("##") // => ["", "##", "", ""]
 * Note.tokenize() // => ["", "", "", ""]
 */
export function tokenize(str: any): [string, string, string, string] {
  if (typeof str !== "string") str = "";
  const m = TOKENIZE.exec(str) as string[];
  return [m[1].toUpperCase(), m[2].replace(/x/g, "##"), m[3], m[4]];
}

const NO_NOTE: Readonly<NoNoteProperties> = Object.freeze({
  pc: null,
  name: null,
  step: null,
  alt: null,
  oct: null,
  octStr: null,
  chroma: null,
  midi: null,
  freq: null
});

const SEMI = [0, 2, 4, 5, 7, 9, 11];

/**
 * @private
 * Parse a note to obtain it's properties (public version is cached and it's called `Note.props`)
 */
function parse(str: string): Properties {
  const tokens = tokenize(str);
  // Will never execute
  // if (tokens === null) return NO_NOTE;
  if (tokens[0] === "" || tokens[3] !== "") return NO_NOTE;
  const [letter, acc, octStr] = tokens;
  const p = {
    letter,
    acc,
    octStr,
    pc: letter + acc,
    name: letter + acc + octStr,
    step: (letter.charCodeAt(0) + 3) % 7,
    alt: acc[0] === "b" ? -acc.length : acc.length,
    oct: octStr.length ? +octStr : null,
    chroma: 0,
    midi: null,
    freq: null
  } as NoteProperties;
  p.chroma = (SEMI[p.step] + p.alt + 120) % 12;
  p.midi = p.oct !== null ? SEMI[p.step] + p.alt + 12 * (p.oct + 1) : null;
  p.freq = midiToFreq(p.midi as number);
  return Object.freeze(p);
}

const cached = {} as { [key in Note]: Properties };
/**
 * Get note properties. It returns an object with the following information:
 *
 * - name {string}: the note name. The letter is always in uppercase
 * - letter {string}: the note letter, always in uppercase
 * - acc {string}: the note accidentals
 * - octave {number}: the octave or null if not present
 * - pc {string}: the pitch class (letter + accidentals)
 * - step {number}: number equivalent of the note letter. 0 means C ... 6 means B.
 * - alt {number}: number equivalent of accidentals (negative are flats, positive sharps)
 * - chroma {number}: number equivalent of the pitch class, where 0 is C, 1 is C# or Db, 2 is D...
 * - midi {number}: the note midi number (IMPORTANT! it can be outside 0 to 127 range)
 * - freq {number}: the frequency using an equal temperament at 440Hz
 *
 * This function *always* returns an object with all this properties, but if it"s
 * not a valid note all properties will be null.
 *
 * The returned object can"t be mutated.
 *
 * @function
 * @param {string} note - the note name in scientific notation
 * @return {Object} an object with the properties (or an object will all properties
 * set to null if not valid note)
 * @example
 * Note.props("fx-3").name // => "F##-3"
 * Note.props("invalid").name // => null
 * Note.props("C#3").oct // => 3
 * Note.props().oct // => null
 */
export function props(note: Note): Properties {
  return cached[note] || (cached[note] = parse(note));
}

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
 * Note.name("cb2") // => "Cb2"
 * ["c", "db3", "2", "g+", "gx4"].map(Note.name) // => ["C", "Db3", null, null, "G##4"]
 */
export function name(str: Note | any): Note | null {
  return props(str).name;
}

/**
 * Get pitch class of a note. The note can be a string or a pitch array.
 *
 * @function
 * @param {string|Pitch}
 * @return {string} the pitch class
 * @example
 * Note.pc("Db3") // => "Db"
 * ["db3", "bb6", "fx2"].map(Note.pc) // => [ "Db", "Bb", "F##"]
 */
export function pc(str: Note): PC | null {
  return props(str).pc;
}

const isMidiRange = (m: number | number): boolean => m >= 0 && m <= 127;
/**
 * Get the note midi number. **It always return a number between 0 and 127**
 *
 * @function
 * @param {string | number} note - the note to get the midi number from
 * @return {number | null} the midi number or null if not valid pitch
 * @example
 * Note.midi("C4") // => 60
 * Note.midi(60) // => 60
 * @see midi.toMidi
 */
export function midi(note: Note | number): number | null {
  if (typeof note !== "number" && typeof note !== "string") {
    return null;
  }
  const midi = props(note as Note).midi;
  const value = midi || midi === 0 ? midi : +note;
  return isMidiRange(value) ? value : null;
}

/**
 * Get the frequency from midi number
 *
 * @param {number} midi - the note midi number
 * @param {number} tuning - (Optional) 440 by default
 * @return {number} the frequency or null if not valid note midi
 */
export function midiToFreq(midi: number, tuning = 440): number | null {
  return typeof midi === "number"
    ? Math.pow(2, (midi - 69) / 12) * tuning
    : null;
}

/**
 * Get the frequency of a note
 *
 * @function
 * @param {string|number} note - the note name or midi note number
 * @return {number} the frequency
 * @example
 * Note.freq("A4") // => 440
 * Note.freq(69) // => 440
 */
export function freq(note: Note | number): number | null {
  return props(note as Note).freq || midiToFreq(note as number);
}

const L2 = Math.log(2);
const L440 = Math.log(440);
/**
 * Get the midi number from a frequency in hertz. The midi number can
 * contain decimals (with two digits precission)
 *
 * @param {number} frequency
 * @return {number}
 * @example
 * Note.freqToMidi(220)); //=> 57;
 * Note.freqToMidi(261.62)); //=> 60;
 * Note.freqToMidi(261)); //=> 59.96;
 */
export function freqToMidi(freq: number): number {
  const v = (12 * (Math.log(freq) - L440)) / L2 + 69;
  return Math.round(v * 100) / 100;
}

/**
 * Return the chroma of a note. The chroma is the numeric equivalent to the
 * pitch class, where 0 is C, 1 is C# or Db, 2 is D... 11 is B
 *
 * @param {string} note - the note or pitch class name
 * @return {number | null} the chroma (0...11) or null if not valid note or pitch class
 *
 * @example
 * Note.chroma("Cb") // => 11
 * ["C", "D", "E", "F"].map(Note.chroma) // => [0, 2, 4, 5]
 */
export function chroma(str: Note | PC): number | null {
  return props(str).chroma;
}

/**
 * Get the octave of the given pitch
 *
 * @param {string} note - the note name
 * @return {number | null} the octave number or null if it's a pitch class or a not valid note
 *
 * @example
 * Note.oct("C#4") // => 4
 * Note.oct("C") // => null
 * Note.oct("blah") // => undefined
 */
export function oct(str: Note): number | null {
  return props(str).oct;
}

const LETTERS = "CDEFGAB";
/**
 * Given a step number return it's letter (0 = C, 1 = D, 2 = E)
 *
 * @param {number} step - a number between 0 and 6
 * @return {string | undefined} the letter or undefined if not a valid step number
 *
 * @example
 * Note.stepToLetter(3) // => "F"
 */
export function stepToLetter(step: number): string | undefined {
  // FIXME: for consistency, it should return null
  return LETTERS[step];
}

// create a string with n strings
const fillStr = (s: string, n: number) => Array(n + 1).join(s);
// create a string with accidentals (depending on number's sign)
const fillAcc = (n: number) => (n < 0 ? fillStr("b", -n) : fillStr("#", n));

/**
 * Given an alteration number, return the accidentals
 *
 * @param {number} alt - the alteration number (negative mean flats)
 * @return {string} the string with the accidentals
 *
 * @example
 * Note.altToAcc(-3) // => "bbb"
 */
export function altToAcc(alt: number): string {
  return typeof alt === "number" ? fillAcc(alt) : "";
}

/**
 * Creates a note name in scientific notation from note properties,
 * and optionally another note name.
 * It receives an object with:
 * - step: the note step (0 = C, 1 = D, ... 6 = B)
 * - alt: (optional) the alteration. Negative numbers are flats, positive sharps
 * - oct: (optional) the octave
 *
 * Optionally it receives another note as a "base", meaning that any prop not explicitly
 * received on the first parameter will be taken from that base note. That way it can be used
 * as an immutable "set" operator for a that base note
 *
 * @param {object} props - the note properties ({ step, alt, oct })
 * @param {string} [baseNote] - note to build the result from. If given, it returns
 * the result of applying the given props to this note.
 * @return {string | null} the note name in scientific notation or null if not valid properties
 *
 * @example
 * Note.from({ step: 5 }) // => "A"
 * Note.from({ step: 1, alt: -1 }) // => "Db"
 * Note.from({ step: 2, alt: 2, oct: 2 }) // => "E##2"
 * Note.from({ step: 7 }) // => null
 * Note.from({alt: 1, oct: 3}, "C4") // => "C#3"
 */
export function from(
  fromProps = {} as Partial<NoteProperties>,
  baseNote: OrNull<Note> = null
): Note | null {
  const { step, alt, oct } = baseNote
    ? Object.assign({}, props(baseNote), fromProps)
    : fromProps;
  if (typeof step !== "number") return null;
  // if (typeof alt !== "number") return null
  const letter = stepToLetter(step);
  if (!letter) return null;
  const pc = letter + altToAcc(alt as number);
  return oct || oct === 0 ? pc + oct : pc;
}

/**
 * FIXME: remove in 3.0
 * Deprecated. This is kept for backwards compatibility only.
 * Use Note.from instead
 */
export const build = from;

/**
 * Given a midi number, returns a note name. The altered notes will have
 * flats unless explicitly set with the optional `useSharps` parameter.
 *
 * @param {number} midi - the midi note number
 * @param {boolean} useSharps - (Optional) set to true to use sharps instead of flats
 * @return {string} the note name
 * @example
 * Note.fromMidi(61) // => "Db4"
 * Note.fromMidi(61, true) // => "C#4"
 * // it rounds to nearest note
 * Note.fromMidi(61.7) // => "D4"
 */
export function fromMidi(m: number, useSharps: boolean = false): Note {
  const midi = Math.round(m);
  const pcs = useSharps === true ? SHARPS : FLATS;
  const pc = pcs[midi % 12];
  const o = Math.floor(midi / 12) - 1;
  return pc + o;
}

/**
 * Simplify the note: find an enhramonic note with less accidentals.
 *
 * @param {string} note - the note to be simplified
 * @param {boolean} useSameAccType - (optional, true by default) set to true
 * to ensure the returned note has the same accidental types that the given note
 * @return {string | null} the simplfiied note or null if not valid note
 * @example
 * Note.simplify("C##") // => "D"
 * Note.simplify("C###") // => "D#"
 * Note.simplify("C###", false) // => "Eb"
 * Note.simplify("B#4") // => "C5"
 */
export function simplify(note: Note, sameAcc: boolean = true): Note | null {
  const { alt, chroma, midi } = props(note);
  if (chroma === null) return null;
  const alteration = alt as number;
  const useSharps = sameAcc === false ? alteration < 0 : alteration > 0;
  return midi === null
    ? pc(fromMidi(chroma, useSharps))
    : fromMidi(midi, useSharps);
}

/**
 * Get the simplified and enhramonic note of the given one.
 *
 * @function
 * @param {string} note
 * @return {string} the enhramonic note
 * @example
 * Note.enharmonic("Db") // => "C#"
 * Note.enhramonic("C") // => "C"
 */
export const enharmonic = (note: Note): Note | null => simplify(note, false);
