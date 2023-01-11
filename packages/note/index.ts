import {
  coordToNote,
  IntervalName,
  Named,
  Note,
  note as props,
  NoteLiteral,
  NoteName,
  Pitch,
  transpose as _tr,
} from "@tonaljs/core";
import { freqToMidi, midiToNoteName } from "@tonaljs/midi";

const NAMES = ["C", "D", "E", "F", "G", "A", "B"];

const toName = (n: Named) => n.name;
const onlyNotes = (array: any[]) =>
  array.map(props).filter((n) => !n.empty) as Note[];

/**
 * Return the natural note names without octave
 * @function
 * @example
 * Note.names(); // => ["C", "D", "E", "F", "G", "A", "B"]
 */
export function names(array?: any[]): string[] {
  if (array === undefined) {
    return NAMES.slice();
  } else if (!Array.isArray(array)) {
    return [];
  } else {
    return onlyNotes(array).map(toName);
  }
}

/**
 * Get a note from a note name
 *
 * @function
 * @example
 * Note.get('Bb4') // => { name: "Bb4", midi: 70, chroma: 10, ... }
 */
export const get = props;

/**
 * Get the note name
 * @function
 */
export const name = (note: NoteLiteral) => get(note).name;

/**
 * Get the note pitch class name
 * @function
 */
export const pitchClass = (note: NoteLiteral) => get(note).pc;

/**
 * Get the note accidentals
 * @function
 */
export const accidentals = (note: NoteLiteral) => get(note).acc;

/**
 * Get the note octave
 * @function
 */
export const octave = (note: NoteLiteral) => get(note).oct;

/**
 * Get the note midi
 * @function
 */
export const midi = (note: NoteLiteral) => get(note).midi;

/**
 * Get the note midi
 * @function
 */
export const freq = (note: NoteLiteral) => get(note).freq;

/**
 * Get the note chroma
 * @function
 */
export const chroma = (note: NoteLiteral) => get(note).chroma;

/**
 * Given a midi number, returns a note name. Uses flats for altered notes.
 *
 * @function
 * @param {number} midi - the midi note number
 * @return {string} the note name
 * @example
 * Note.fromMidi(61) // => "Db4"
 * Note.fromMidi(61.7) // => "D4"
 */
export function fromMidi(midi: number) {
  return midiToNoteName(midi);
}

/**
 * Given a midi number, returns a note name. Uses flats for altered notes.
 */
export function fromFreq(freq: number) {
  return midiToNoteName(freqToMidi(freq));
}
/**
 * Given a midi number, returns a note name. Uses flats for altered notes.
 */
export function fromFreqSharps(freq: number) {
  return midiToNoteName(freqToMidi(freq), { sharps: true });
}

/**
 * Given a midi number, returns a note name. Uses flats for altered notes.
 *
 * @function
 * @param {number} midi - the midi note number
 * @return {string} the note name
 * @example
 * Note.fromMidiSharps(61) // => "C#4"
 */

export function fromMidiSharps(midi: number) {
  return midiToNoteName(midi, { sharps: true });
}

/**
 * Transpose a note by an interval
 */
export const transpose = _tr;
export const tr = _tr;

/**
 * Transpose by an interval.
 * @function
 * @param {string} interval
 * @return {function} a function that transposes by the given interval
 * @example
 * ["C", "D", "E"].map(Note.transposeBy("5P"));
 * // => ["G", "A", "B"]
 */
export const transposeBy = (interval: IntervalName) => (note: NoteName) =>
  transpose(note, interval);
export const trBy = transposeBy;

/**
 * Transpose from a note
 * @function
 * @param {string} note
 * @return {function}  a function that transposes the the note by an interval
 * ["1P", "3M", "5P"].map(Note.transposeFrom("C"));
 * // => ["C", "E", "G"]
 */
export const transposeFrom = (note: NoteName) => (interval: IntervalName) =>
  transpose(note, interval);
export const trFrom = transposeFrom;

/**
 * Transpose a note by a number of perfect fifths.
 *
 * @function
 * @param {string} note - the note name
 * @param {number} fifhts - the number of fifths
 * @return {string} the transposed note name
 *
 * @example
 * import { transposeFifths } from "@tonaljs/note"
 * transposeFifths("G4", 1) // => "D"
 * [0, 1, 2, 3, 4].map(fifths => transposeFifths("C", fifths)) // => ["C", "G", "D", "A", "E"]
 */
export function transposeFifths(noteName: NoteName, fifths: number): NoteName {
  const note = get(noteName);
  if (note.empty) {
    return "";
  }
  const [nFifths, nOcts] = note.coord;
  const transposed =
    nOcts === undefined
      ? coordToNote([nFifths + fifths])
      : coordToNote([nFifths + fifths, nOcts]);

  return transposed.name;
}
export const trFifths = transposeFifths;

// TODO: documentation
export function transposeOctaves(
  noteName: NoteName,
  octaves: number
): NoteName {
  const note = get(noteName);
  if (note.empty) {
    return "";
  }
  const [nFifths, nOcts] = note.coord;
  const transposed =
    nOcts === undefined
      ? coordToNote([nFifths])
      : coordToNote([nFifths, nOcts + octaves]);

  return transposed.name;
}

export type NoteComparator = (a: Note, b: Note) => number;

export const ascending: NoteComparator = (a, b) => a.height - b.height;
export const descending: NoteComparator = (a, b) => b.height - a.height;

export function sortedNames(
  notes: any[],
  comparator?: NoteComparator
): string[] {
  comparator = comparator || ascending;
  return onlyNotes(notes).sort(comparator).map(toName);
}

export function sortedUniqNames(notes: any[]): string[] {
  return sortedNames(notes, ascending).filter(
    (n, i, a) => i === 0 || n !== a[i - 1]
  );
}

/**
 * Simplify a note
 *
 * @function
 * @param {string} note - the note to be simplified
 * - sameAccType: default true. Use same kind of accidentals that source
 * @return {string} the simplified note or '' if not valid note
 * @example
 * simplify("C##") // => "D"
 * simplify("C###") // => "D#"
 * simplify("C###")
 * simplify("B#4") // => "C5"
 */
export const simplify = (noteName: NoteName | Pitch): string => {
  const note = get(noteName);
  if (note.empty) {
    return "";
  }
  return midiToNoteName(note.midi || note.chroma, {
    sharps: note.alt > 0,
    pitchClass: note.midi === null,
  });
};
/**
 * Get enharmonic of a note
 *
 * @function
 * @param {string} note
 * @param [string] - [optional] Destination pitch class
 * @return {string} the enharmonic note name or '' if not valid note
 * @example
 * Note.enharmonic("Db") // => "C#"
 * Note.enharmonic("C") // => "C"
 * Note.enharmonic("F2","E#") // => "E#2"
 */
export function enharmonic(noteName: string, destName?: string) {
  const src = get(noteName);
  if (src.empty) {
    return "";
  }

  // destination: use given or generate one
  const dest = get(
    destName ||
      midiToNoteName(src.midi || src.chroma, {
        sharps: src.alt < 0,
        pitchClass: true,
      })
  );

  // ensure destination is valid
  if (dest.empty || dest.chroma !== src.chroma) {
    return "";
  }

  // if src has no octave, no need to calculate anything else
  if (src.oct === undefined) {
    return dest.pc;
  }

  // detect any octave overflow
  const srcChroma = src.chroma - src.alt;
  const destChroma = dest.chroma - dest.alt;
  const destOctOffset =
    srcChroma > 11 || destChroma < 0
      ? -1
      : srcChroma < 0 || destChroma > 11
      ? +1
      : 0;
  // calculate the new octave
  const destOct = src.oct + destOctOffset;
  return dest.pc + destOct;
}

export default {
  names,
  get,
  name,
  pitchClass,
  accidentals,
  octave,
  midi,
  ascending,
  descending,
  sortedNames,
  sortedUniqNames,
  fromMidi,
  fromMidiSharps,
  freq,
  fromFreq,
  fromFreqSharps,
  chroma,
  transpose,
  tr,
  transposeBy,
  trBy,
  transposeFrom,
  trFrom,
  transposeFifths,
  trFifths,
  simplify,
  enharmonic,
};
