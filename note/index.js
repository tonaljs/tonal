/**
 * A collection of functions to manipulate musical notes in scientific notation
 *
 * ## Usage
 *
 * @example
 * import Note from "tonal/note"
 * Note.name("bb2") // => "Bb2"
 * Note.chroma("bb2") // => 10
 * Note.midi("a4") // => 69
 * Note.freq("a4") // => 440
 * Note.oct("G3") // => 3
 *
 * @example
 * const Tonal = require('tonal')
 * Tonal.Note.midi("C4") // => 60
 *
 * ## API
 *
 * @module Note
 */
export default {
  tokenize,
  props,
  name,
  names,
  pc,
  oct,
  chroma,
  midi,
  freq,
  fromMidi,
  freqToMidi,
  altToAcc,
  stepToLetter,
  fromProps,
  simplify,
  enharmonic
};

const NAMES = "C C# Db D D# Eb E F F# Gb G G# Ab A A# Bb B".split(" ");

/**
 * Get a list of note names (pitch classes) within a octave
 *
 * @param {string} filter - an object with
 * - [boolean] unaltered: defaults to true
 * - [boolean] flats: defaults to false
 * - [boolean] sharps: defaults to false
 * @return {Array<string>} the list of notes
 *
 * @example
 * Note.names() // => [ "C", "D", "E", "F", "G", "A", "B" ]
 * Note.names({ flats: true }) // => [ "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B" ]
 * Note.names({ sharps: true }) // => [ "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B" ]
 * Note.names({ unaltered: false, flats: true })
 * // => [ "Db", "Eb", "Gb", "Ab", "Bb" ]
 */
export function names(types = {}) {
  return NAMES.filter(
    note =>
      (types.unaltered !== false && note[1] === undefined) ||
      (types.flats === true && note[1] === "b") ||
      (types.sharps === true && note[1] === "#")
  );
}

const SHARPS = names({ sharps: true });
const FLATS = names({ flats: true });
const REGEX = /^([a-gA-G]?)(#{1,}|b{1,}|x{1,}|)(-?\d*)\s*(.*)$/;

/**
 * Split a string into tokens related to note parts.
 * It returns an array of strings `[letter, accidental, octave, modifier]`
 *
 * It always returns an array
 *
 * @param {string} str
 * @return {Array} an array of note tokens
 * @example
 * Note.tokenize("C#2") // => ["C", "#", "2", ""]
 * Note.tokenize("Db3 major") // => ["D", "b", "3", "major"]
 * Note.tokenize("major") // => ["", "", "", "major"]
 * Note.tokenize("##") // => ["", "##", "", ""]
 * Note.tokenize() // => ["", "", "", ""]
 */
export function tokenize(str) {
  if (typeof str !== "string") str = "";
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
  octStr: null,
  chroma: null,
  midi: null,
  freq: null
});

const SEMI = [0, 2, 4, 5, 7, 9, 11];
const properties = str => {
  const tokens = tokenize(str);
  if (tokens[0] === "" || tokens[3] !== "") return NO_NOTE;
  const [letter, acc, octStr] = tokens;
  const p = { letter, acc, octStr };
  p.pc = p.letter + p.acc;
  p.name = p.pc + octStr;
  p.step = (p.letter.charCodeAt(0) + 3) % 7;
  p.alt = p.acc[0] === "b" ? -p.acc.length : p.acc.length;
  p.oct = octStr.length ? +octStr : null;
  p.chroma = (SEMI[p.step] + p.alt + 120) % 12;
  p.midi = p.oct !== null ? SEMI[p.step] + p.alt + 12 * (p.oct + 1) : null;
  p.freq = midiToFreq(p.midi);
  return Object.freeze(p);
};

let cached = {};
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
 * @param {string} note - the note name in scientific notation
 * @return {Object} an object with the properties (or an object will all properties
 * set to null if not valid note)
 * @example
 * Note.props("fx-3").name // => "F##-3"
 * Note.props("invalid").name // => null
 * Note.props("C#3").oct // => 3
 * Note.props().oct // => null
 */
export function props(str) {
  return cached[str] || (cached[str] = properties(str));
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
export function name(str) {
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
export function pc(str) {
  return props(str).pc;
}

const isMidiRange = m => m >= 0 && m <= 127;
/**
 * Get the note midi number. It always return a number between 0 and 127
 *
 * @function
 * @param {string|Number} note - the note to get the midi number from
 * @return {Integer} the midi number or null if not valid pitch
 * @example
 * Note.midi("C4") // => 60
 * Note.midi(60) // => 60
 * @see midi.toMidi
 */
export function midi(note) {
  if (typeof note !== "number" && typeof note !== "string") {
    return null;
  }
  const midi = props(note).midi;
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
export const midiToFreq = (midi, tuning = 440) =>
  typeof midi === "number" ? Math.pow(2, (midi - 69) / 12) * tuning : null;

/**
 * Get the frequency of a note
 *
 * @function
 * @param {string|Number} note - the note name or midi note number
 * @return {number} the frequency
 * @example
 * Note.freq("A4") // => 440
 * Note.freq(69) // => 440
 */
export function freq(note) {
  return props(note).freq || midiToFreq(note);
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
export function freqToMidi(freq) {
  const v = (12 * (Math.log(freq) - L440)) / L2 + 69;
  return Math.round(v * 100) / 100;
}

/**
 * Return the chroma of a note. The chroma is the numeric equivalent to the
 * pitch class, where 0 is C, 1 is C# or Db, 2 is D... 11 is B
 *
 * @param {string} note - the note name
 * @return {Integer} the chroma number
 * @example
 * Note.chroma("Cb") // => 11
 * ["C", "D", "E", "F"].map(Note.chroma) // => [0, 2, 4, 5]
 */
export function chroma(str) {
  return props(str).chroma;
}

/**
 * Get the octave of the given pitch
 *
 * @function
 * @param {string} note - the note
 * @return {Integer} the octave or null if doesn"t have an octave or not a valid note
 * @example
 * Note.oct("C#4") // => 4
 * Note.oct("C") // => null
 * Note.oct("blah") // => undefined
 */
export function oct(str) {
  return props(str).oct;
}

const LETTERS = "CDEFGAB";
/**
 * Given a step number return it's letter (0 = C, 1 = D, 2 = E)
 * @param {number} step
 * @return {string} the letter
 * @example
 * Note.stepToLetter(3) // => "F"
 */
export function stepToLetter(step) {
  return LETTERS[step];
}

const fillStr = (s, n) => Array(n + 1).join(s);
const numToStr = (num, op) => (typeof num !== "number" ? "" : op(num));

/**
 * Given an alteration number, return the accidentals
 * @param {number} alt
 * @return {string}
 * @example
 * Note.altToAcc(-3) // => "bbb"
 */
export function altToAcc(alt) {
  return numToStr(alt, alt =>
    alt < 0 ? fillStr("b", -alt) : fillStr("#", alt)
  );
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
 * @function
 * @param {Object} props - the note properties
 * @param {string} [baseNote] - note to build the result from. If given, it returns
 * the result of applying the given props to this note.
 * @return {string} the note name in scientific notation or null if not valid properties
 * @example
 * Note.from({ step: 5 }) // => "A"
 * Note.from({ step: 1, acc: -1 }) // => "Db"
 * Note.from({ step: 2, acc: 2, oct: 2 }) // => "E##2"
 * Note.from({ step: 7 }) // => null
 * Note.from({alt: 1, oct: 3}, "C4") // => "C#3"
 */
export function fromProps(fromProps = {}, baseNote = null) {
  const { step, alt, oct } = baseNote
    ? Object.assign({}, props(baseNote), fromProps)
    : fromProps;
  const letter = stepToLetter(step);
  if (!letter) return null;
  const pc = letter + altToAcc(alt);
  return oct || oct === 0 ? pc + oct : pc;
}

/**
 * Given a midi number, returns a note name. The altered notes will have
 * flats unless explicitly set with the optional `useSharps` parameter.
 *
 * @function
 * @param {number} midi - the midi note number
 * @param {Object} options = default: `{ sharps: false, pitchClass: false }`
 * @param {boolean} useSharps - (Optional) set to true to use sharps instead of flats
 * @return {string} the note name
 * @example
 * Note.fromMidi(61) // => "Db4"
 * Note.fromMidi(61, { pitchClass: true }) // => "Db"
 * Note.fromMidi(61, { sharps: true }) // => "C#4"
 * Note.fromMidi(61, { pitchClass: true, sharps: true }) // => "C#"
 * // it rounds to nearest note
 * Note.fromMidi(61.7) // => "D4"
 */
export function fromMidi(num, options = {}) {
  num = Math.round(num);
  const pcs = options.sharps === true ? SHARPS : FLATS;
  const pc = pcs[num % 12];
  if (options.pitchClass) return pc;
  const o = Math.floor(num / 12) - 1;
  return pc + o;
}

/**
 * Simplify the note: find an enhramonic note with less accidentals.
 *
 * @param {string} note - the note to be simplified
 * @param {object} options
 * - sameAccType: default true. Use same kind of accidentals that source
 * @return {string} the simplfiied note or null if not valid note
 * @example
 * Note.simplify("C##") // => "D"
 * Note.simplify("C###") // => "D#"
 * Note.simplify("C###", { sameAccType : false }) // => "Eb"
 * Note.simplify("B#4") // => "C5"
 */
export function simplify(note, options = {}) {
  const { alt, chroma, midi } = props(note);
  if (chroma === null) return null;

  const sharps = options.sameAccType === false ? alt < 0 : alt > 0;
  const pitchClass = midi === null;

  return fromMidi(midi || chroma, { sharps, pitchClass });
}

/**
 * Get the simplified and enhramonic note of the given one.
 *
 * @param {string} note
 * @return {string} the enhramonic note
 * @example
 * Note.enharmonic("Db") // => "C#"
 * Note.enhramonic("C") // => "C"
 */
export function enharmonic(note) {
  return simplify(note, false);
}
