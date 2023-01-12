import { note as props, NoteName } from "@tonaljs/core";

type Midi = number;

export function isMidi(arg: any): arg is Midi {
  return +arg >= 0 && +arg <= 127;
}

/**
 * Get the note midi number (a number between 0 and 127)
 *
 * It returns undefined if not valid note name
 *
 * @function
 * @param {string|number} note - the note name or midi number
 * @return {Integer} the midi number or undefined if not valid note
 * @example
 * import { toMidi } from '@tonaljs/midi'
 * toMidi("C4") // => 60
 * toMidi(60) // => 60
 * toMidi('60') // => 60
 */
export function toMidi(note: NoteName | number): number | null {
  if (isMidi(note)) {
    return +note;
  }
  const n = props(note);
  return n.empty ? null : n.midi;
}

/**
 * Get the frequency in hertzs from midi number
 *
 * @param {number} midi - the note midi number
 * @param {number} [tuning = 440] - A4 tuning frequency in Hz (440 by default)
 * @return {number} the frequency or null if not valid note midi
 * @example
 * import { midiToFreq} from '@tonaljs/midi'
 * midiToFreq(69) // => 440
 */
export function midiToFreq(midi: number, tuning = 440): number {
  return Math.pow(2, (midi - 69) / 12) * tuning;
}

const L2 = Math.log(2);
const L440 = Math.log(440);

/**
 * Get the midi number from a frequency in hertz. The midi number can
 * contain decimals (with two digits precision)
 *
 * @param {number} frequency
 * @return {number}
 * @example
 * import { freqToMidi} from '@tonaljs/midi'
 * freqToMidi(220)); //=> 57
 * freqToMidi(261.62)); //=> 60
 * freqToMidi(261)); //=> 59.96
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
 * Given a midi number, returns a note name. The altered notes will have
 * flats unless explicitly set with the optional `useSharps` parameter.
 *
 * @function
 * @param {number} midi - the midi note number
 * @param {Object} options = default: `{ sharps: false, pitchClass: false }`
 * @param {boolean} useSharps - (Optional) set to true to use sharps instead of flats
 * @return {string} the note name
 * @example
 * import { midiToNoteName } from '@tonaljs/midi'
 * midiToNoteName(61) // => "Db4"
 * midiToNoteName(61, { pitchClass: true }) // => "Db"
 * midiToNoteName(61, { sharps: true }) // => "C#4"
 * midiToNoteName(61, { pitchClass: true, sharps: true }) // => "C#"
 * // it rounds to nearest note
 * midiToNoteName(61.7) // => "D4"
 */
export function midiToNoteName(midi: number, options: ToNoteNameOptions = {}) {
  if (isNaN(midi) || midi === -Infinity || midi === Infinity) return "";
  midi = Math.round(midi);
  const pcs = options.sharps === true ? SHARPS : FLATS;
  const pc = pcs[midi % 12];
  if (options.pitchClass) {
    return pc;
  }
  const o = Math.floor(midi / 12) - 1;
  return pc + o;
}

export function chroma(midi: number): number {
  return midi % 12;
}

function pcsetFromChroma(chroma: string): number[] {
  return chroma.split("").reduce((pcset, val, index) => {
    if (index < 12 && val === "1") pcset.push(index);
    return pcset;
  }, [] as number[]);
}

function pcsetFromMidi(midi: number[]): number[] {
  return midi
    .map(chroma)
    .sort((a, b) => a - b)
    .filter((n, i, a) => i === 0 || n !== a[i - 1]);
}

/**
 * Given a list of midi numbers, returns the pitch class set (unique chroma numbers)
 * @param midi
 * @example
 *
 */
export function pcset(notes: number[] | string): number[] {
  return Array.isArray(notes) ? pcsetFromMidi(notes) : pcsetFromChroma(notes);
}

export function pcsetNearest(notes: number[] | string) {
  const set = pcset(notes);
  return (midi: number): number | undefined => {
    const ch = chroma(midi);
    for (let i = 0; i < 12; i++) {
      if (set.includes(ch + i)) return midi + i;
      if (set.includes(ch - i)) return midi - i;
    }
    return undefined;
  };
}

export function pcsetSteps(notes: number[] | string, tonic: number) {
  const set = pcset(notes);
  const len = set.length;
  return (step: number): number => {
    const index = step < 0 ? (len - (-step % len)) % len : step % len;
    const octaves = Math.floor(step / len);
    return set[index] + octaves * 12 + tonic;
  };
}

export function pcsetDegrees(notes: number[] | string, tonic: number) {
  const steps = pcsetSteps(notes, tonic);
  return (degree: number): number | undefined => {
    if (degree === 0) return undefined;
    return steps(degree > 0 ? degree - 1 : degree);
  };
}

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
