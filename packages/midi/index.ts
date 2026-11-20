import { NoteName, note as props } from "@tonaljs/pitch-note";

type Midi = number;

/**
 * Check if a value is a valid midi number: a number, or a numeric string, from
 * 0 to 127. Note names are not midi numbers. A numeric string stays a
 * string: convert it with `Midi.toMidi` (or `+value`) before using it as a
 * number.
 *
 * @example
 * Midi.isMidi(60) // => true
 * Midi.isMidi("60") // => true
 * Midi.isMidi(128) // => false
 * Midi.isMidi("C4") // => false
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isMidi(arg: any): arg is Midi | `${number}` {
  // only numbers and numeric strings: `+""`, `+null` or `+[]` would give 0
  const n =
    typeof arg === "string" && arg.trim() !== ""
      ? +arg
      : typeof arg === "number"
        ? arg
        : NaN;
  return n >= 0 && n <= 127;
}

/**
 * Get the midi number (0 to 127) of a note name or midi number. It returns
 * null if the note is not valid, has no octave or is out of range.
 *
 * @function
 * @param {string|number} note - the note name or midi number
 * @return {Integer|null} the midi number or null if not valid note
 * @example
 * Midi.toMidi("C4") // => 60
 * Midi.toMidi(60) // => 60
 * Midi.toMidi("60") // => 60
 * Midi.toMidi("x") // => null
 */
export function toMidi(note: NoteName | number): number | null {
  if (isMidi(note)) {
    return +note;
  }
  const n = props(note);
  return n.empty ? null : n.midi;
}

/**
 * Get the frequency in hertz of a midi number.
 *
 * @param {number} midi - the note midi number
 * @param {number} [tuning = 440] - A4 tuning frequency in Hz (440 by default)
 * @return {number} the frequency in hertz
 * @example
 * Midi.midiToFreq(69) // => 440
 * Midi.midiToFreq(69, 432) // => 432
 */
export function midiToFreq(midi: number, tuning = 440): number {
  return Math.pow(2, (midi - 69) / 12) * tuning;
}

const L2 = Math.log(2);
const L440 = Math.log(440);

/**
 * Get the midi number of a frequency in hertz. The midi number can
 * contain decimals (rounded to two digits).
 *
 * @param {number} frequency
 * @return {number}
 * @example
 * Midi.freqToMidi(220) // => 57
 * Midi.freqToMidi(261.62) // => 60
 * Midi.freqToMidi(261) // => 59.96
 */
export function freqToMidi(freq: number): number {
  const v = (12 * (Math.log(freq) - L440)) / L2 + 69;
  return Math.round(v * 100) / 100;
}

export interface ToNoteNameOptions {
  pitchClass?: boolean;
  sharps?: boolean;
}

const SHARPS = "C C# D D# E F F# G G# A A# B".split(" ");
const FLATS = "C Db D Eb E F Gb G Ab A Bb B".split(" ");
/**
 * Get the note name of a midi number. Altered notes use flats unless
 * `sharps: true`, and `pitchClass: true` drops the octave. Decimals are
 * rounded to the nearest note, and NaN or infinite numbers give "".
 *
 * @function
 * @param {number} midi - the midi note number
 * @param {Object} options - `{ sharps: false, pitchClass: false }` by default
 * @return {string} the note name
 * @example
 * Midi.midiToNoteName(61) // => "Db4"
 * Midi.midiToNoteName(61, { pitchClass: true }) // => "Db"
 * Midi.midiToNoteName(61, { sharps: true }) // => "C#4"
 * Midi.midiToNoteName(61.7) // => "D4"
 */
export function midiToNoteName(midi: number, options: ToNoteNameOptions = {}) {
  if (isNaN(midi) || midi === -Infinity || midi === Infinity) return "";
  midi = Math.round(midi);
  const pcs = options.sharps === true ? SHARPS : FLATS;
  const pc = pcs[((midi % 12) + 12) % 12];
  if (options.pitchClass) {
    return pc;
  }
  const o = Math.floor(midi / 12) - 1;
  return pc + o;
}

/**
 * Get the pitch class of a midi number, from 0 up to (not including) 12.
 * A decimal midi number keeps its fraction.
 *
 * @example
 * Midi.chroma(61) // => 1
 * Midi.chroma(61.5) // => 1.5
 * Midi.chroma(-1) // => 11
 */
export function chroma(midi: number): number {
  return ((midi % 12) + 12) % 12;
}

function pcsetFromChroma(chroma: string): number[] {
  return chroma.split("").reduce((pcset, val, index) => {
    if (index < 12 && val === "1") pcset.push(index);
    return pcset;
  }, [] as number[]);
}

function pcsetFromMidi(midi: number[]): number[] {
  return midi
    .filter((n) => Number.isFinite(n))
    .map((n) => chroma(Math.round(n)))
    .sort((a, b) => a - b)
    .filter((n, i, a) => i === 0 || n !== a[i - 1]);
}

/**
 * Given a list of midi numbers, returns the pitch class set: the unique
 * pitch classes (whole numbers from 0 to 11), sorted.
 * Decimal midi numbers are rounded to the nearest note first, and numbers that
 * aren't finite are ignored.
 * @param notes - a list of midi numbers or a chroma string (e.g. "100100100101")
 * @example
 * Midi.pcset([62, 63, 60, 65, 70, 72]) // => [0, 2, 3, 5, 10]
 * Midi.pcset([60.4, 64, 67.6]) // => [0, 4, 8]
 * Midi.pcset("100100100101") // => [0, 3, 6, 9, 11]
 */
export function pcset(notes: number[] | string): number[] {
  return Array.isArray(notes) ? pcsetFromMidi(notes) : pcsetFromChroma(notes);
}

/**
 * Get a function that maps a midi number to the nearest midi number whose
 * pitch class is in the set (a tie goes up). Can be used to constrain a note
 * to a scale. The function returns undefined if the number is not finite.
 * @param notes - a list of midi numbers or a chroma string (e.g. "100100100101")
 * @example
 * const nearest = Midi.pcsetNearest(Scale.get("D dorian").chroma);
 * [60, 61, 62, 63, 64, 65, 66].map(nearest) // => [60, 62, 62, 63, 65, 65, 67]
 */
export function pcsetNearest(notes: number[] | string) {
  const set = pcset(notes);
  return (midi: number): number | undefined => {
    if (!isFinite(midi)) return undefined;
    let nearest: number | undefined;
    for (const pc of set) {
      // the closest midi note with this pitch class (6 semitones away goes up)
      const note = pc + 12 * Math.round((midi - pc) / 12);
      if (
        nearest === undefined ||
        Math.abs(note - midi) < Math.abs(nearest - midi) ||
        (Math.abs(note - midi) === Math.abs(nearest - midi) && note > nearest)
      ) {
        nearest = note;
      }
    }
    return nearest;
  };
}

/**
 * Get a function that maps a step number to a midi number: step 0 is the
 * tonic (the first pitch class of the set above it), step 1 the second, and so
 * on, going up an octave every time the set wraps. Negative steps go down.
 * @param notes - a list of midi numbers or a chroma string
 * @param tonic - the midi number of step 0
 * @example
 * const steps = Midi.pcsetSteps(Scale.get("D dorian").chroma, 60);
 * [-2, -1, 0, 1, 2, 3].map(steps) // => [57, 58, 60, 62, 63, 65]
 */
export function pcsetSteps(notes: number[] | string, tonic: number) {
  const set = pcset(notes);
  const len = set.length;
  return (step: number): number => {
    const index = step < 0 ? (len - (-step % len)) % len : step % len;
    const octaves = Math.floor(step / len);
    return set[index] + octaves * 12 + tonic;
  };
}

/**
 * Same as pcsetSteps, but degrees start at 1 (the tonic) and go down to -1
 * (the note below the tonic). The function returns undefined for degree 0.
 *
 * @example
 * const degrees = Midi.pcsetDegrees([0, 2, 4], 60);
 * [-1, 1, 2, 3, 4].map(degrees) // => [52, 60, 62, 64, 72]
 */
export function pcsetDegrees(notes: number[] | string, tonic: number) {
  const steps = pcsetSteps(notes, tonic);
  return (degree: number): number | undefined => {
    if (degree === 0) return undefined;
    return steps(degree > 0 ? degree - 1 : degree);
  };
}

/** @deprecated */
export default {
  chroma,
  freqToMidi,
  isMidi,
  midiToFreq,
  midiToNoteName,
  pcsetNearest,
  pcset,
  pcsetDegrees,
  pcsetSteps,
  toMidi,
};
