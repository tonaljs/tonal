/* eslint-disable @typescript-eslint/no-explicit-any */
import { freqToMidi, midiToNoteName } from "@tonaljs/midi";
import { Pitch } from "@tonaljs/pitch";
import { distance as _dist, transpose as _tr } from "@tonaljs/pitch-distance";
import { IntervalName } from "@tonaljs/pitch-interval";
import {
  Note,
  NoteLiteral,
  NoteName,
  note as props,
} from "@tonaljs/pitch-note";

export type { NoteType } from "@tonaljs/pitch-note";

const NAMES = ["C", "D", "E", "F", "G", "A", "B"];

const toName = (n: Note) => n.name;
const onlyNotes = (array: any[]) =>
  (Array.isArray(array) ? array : [])
    .map(props)
    .filter((n) => !n.empty) as Note[];

/**
 * Get the natural note names without octave. If an array is given, get the
 * names of the valid notes in it (invalid ones are removed; a non-array gives
 * `[]`).
 *
 * @function
 * @example
 * Note.names() // => ["C", "D", "E", "F", "G", "A", "B"]
 * Note.names(["c", "d4", "x"]) // => ["C", "D4"]
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
 * Get the Note object of a note name (or pitch object). Invalid input gives
 * an object with `empty: true` and `name: ""`.
 *
 * @function
 * @example
 * Note.get("Bb4") // => { name: "Bb4", pc: "Bb", midi: 70, chroma: 10, freq: 466.16..., ... }
 * Note.get("x").empty // => true
 */
export const get = props;

/**
 * Get the normalized note name, or "" if not valid.
 *
 * @function
 * @example
 * Note.name("db4") // => "Db4"
 * Note.name("x") // => ""
 */
export const name = (note: NoteLiteral) => get(note).name;

/**
 * Get the pitch class name (the note name without octave), or "" if not
 * valid.
 *
 * @function
 * @example
 * Note.pitchClass("Db4") // => "Db"
 */
export const pitchClass = (note: NoteLiteral) => get(note).pc;

/**
 * Get the accidentals of a note ("#", "b", "##"...), or "" if it has none or
 * is not valid.
 *
 * @function
 * @example
 * Note.accidentals("Db4") // => "b"
 * Note.accidentals("C4") // => ""
 */
export const accidentals = (note: NoteLiteral) => get(note).acc;

/**
 * Get the octave number of a note, or undefined if it has no octave or is not
 * valid.
 *
 * @function
 * @example
 * Note.octave("C4") // => 4
 * Note.octave("C") // => undefined
 */
export const octave = (note: NoteLiteral) => get(note).oct;

/**
 * Get the midi number (0 to 127) of a note, or null if the note has no octave,
 * is out of range or is not valid.
 *
 * @function
 * @example
 * Note.midi("C4") // => 60
 * Note.midi("C") // => null
 */
export const midi = (note: NoteLiteral) => get(note).midi;

/**
 * Get the frequency in hertz of a note (A4 is 440), or null if the note has
 * no octave or is not valid.
 *
 * @function
 * @example
 * Note.freq("A4") // => 440
 * Note.freq("C") // => null
 */
export const freq = (note: NoteLiteral) => get(note).freq;

/**
 * Get the chroma of a note: its pitch class number from 0 (C) to 11 (B), or
 * NaN if not valid.
 *
 * @function
 * @example
 * Note.chroma("D") // => 2
 * Note.chroma("C#4") // => 1
 */
export const chroma = (note: NoteLiteral) => get(note).chroma;

/**
 * Get the note name of a midi number, using flats for altered notes. Decimals
 * are rounded to the nearest note, and a non-numeric value gives "".
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
 * Get the note name (with flats for altered notes) nearest to a frequency in
 * hertz.
 *
 * @example
 * Note.fromFreq(440) // => "A4"
 * Note.fromFreq(466.16) // => "Bb4"
 */
export function fromFreq(freq: number) {
  return midiToNoteName(freqToMidi(freq));
}
/**
 * Get the note name (with sharps for altered notes) nearest to a frequency in
 * hertz.
 *
 * @example
 * Note.fromFreqSharps(466.16) // => "A#4"
 */
export function fromFreqSharps(freq: number) {
  return midiToNoteName(freqToMidi(freq), { sharps: true });
}

/**
 * Get the note name of a midi number, using sharps for altered notes. Decimals
 * are rounded to the nearest note, and a non-numeric value gives "".
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
 * Get the interval name between two notes or pitch classes, or "" if either
 * is not valid.
 *
 * @example
 * Note.distance("C4", "G4") // => "5P"
 * Note.distance("C", "E") // => "3M"
 */
export const distance = _dist;

/**
 * Transpose a note by an interval. It returns the transposed note name, or ""
 * if the note or the interval are not valid.
 *
 * @example
 * Note.transpose("C4", "5P") // => "G4"
 * Note.transpose("D", "3M") // => "F#"
 * Note.transpose("x", "3M") // => ""
 */
export const transpose = _tr;

/** Alias of Note.transpose. */
export const tr = _tr;

/**
 * Get a function that transposes a note by the given interval.
 *
 * @function
 * @param {string} interval
 * @return {function} a function that transposes by the given interval
 * @example
 * ["C", "D", "E"].map(Note.transposeBy("5P")) // => ["G", "A", "B"]
 */
export const transposeBy = (interval: IntervalName) => (note: NoteName) =>
  transpose(note, interval);

/** Alias of Note.transposeBy. */
export const trBy = transposeBy;

/**
 * Get a function that transposes the given note by an interval.
 *
 * @function
 * @param {string} note
 * @return {function} a function that transposes the note by an interval
 * @example
 * ["1P", "3M", "5P"].map(Note.transposeFrom("C")) // => ["C", "E", "G"]
 */
export const transposeFrom = (note: NoteName) => (interval: IntervalName) =>
  transpose(note, interval);

/** Alias of Note.transposeFrom. */
export const trFrom = transposeFrom;

/**
 * Transpose a note by a number of perfect fifths.
 *
 * @function
 * @param {string} note - the note name
 * @param {number} fifths - the number of fifths
 * @return {string} the transposed note name, or "" if not valid
 *
 * @example
 * Note.transposeFifths("G4", 1) // => "D5"
 * [0, 1, 2, 3, 4].map(fifths => Note.transposeFifths("C", fifths)) // => ["C", "G", "D", "A", "E"]
 */
export function transposeFifths(noteName: NoteName, fifths: number): NoteName {
  return transpose(noteName, [fifths, 0]);
}

/** Alias of Note.transposeFifths. */
export const trFifths = transposeFifths;

/**
 * Transpose a note by a number of octaves (can be negative). It returns the
 * transposed note name, or "" if not valid.
 *
 * @example
 * Note.transposeOctaves("C4", 1) // => "C5"
 * Note.transposeOctaves("C4", -2) // => "C2"
 */
export function transposeOctaves(
  noteName: NoteName,
  octaves: number,
): NoteName {
  return transpose(noteName, [0, octaves]);
}

/** The options of `Note.fold`. */
export type FoldOptions = {
  /** Move each note on its own instead of the whole figure. Default `false`. */
  each?: boolean;
};

// The octave moves that put the notes from `lowest` to `highest` (heights)
// in the range, as [from, to] (none if from > to)
const octavesInto = (
  low: number,
  high: number,
  lowest: number,
  highest: number,
) => [Math.ceil((low - lowest) / 12), Math.floor((high - highest) / 12)];

// The move of fewest octaves in [from, to]
const fewest = (from: number, to: number) =>
  from > 0 ? from : to < 0 ? to : 0;

/**
 * Move notes by octaves into a range of notes, `[low, high]` (both
 * included), keeping their spelling.
 *
 * By default the whole figure moves together, so it keeps its shape: it moves
 * by the fewest octaves that put every note in the range, and doesn't move if
 * it's already there. A figure too wide for the range has its lowest note put
 * in the lowest octave at or above `low`. With `each: true`, each note moves
 * on its own by the fewest octaves that put it in the range. In a range under
 * an octave a note may have no octave there: it goes to the octave nearest
 * the range (ties go up). To keep the shape where it fits and fix the notes
 * at the edges, fold the whole figure first and then each note.
 *
 * A pitch class (a note without octave) has no octave to keep, so it goes on
 * its own to the lowest octave at or above `low` (or, in a range under an
 * octave, to the octave nearest the range), in either mode.
 *
 * It returns `[]` if the notes are empty or one isn't a note, or if the range
 * isn't two notes with octave from low to high.
 * @param notes - the notes, like ["C2", "E2", "G2"]
 * @param range - the lowest and highest notes, like ["E2", "G3"]
 * @param options - `each: true` to move each note on its own
 * @returns the notes moved into the range
 * @example
 * Note.fold(["C2", "E2", "G2", "Bb2"], ["E2", "G3"]); // => ["C3", "E3", "G3", "Bb3"]
 * Note.fold(["C2", "E2", "G2", "Bb2"], ["E2", "G3"], { each: true }); // => ["C3", "E2", "G2", "Bb2"]
 * Note.fold(["C5", "E5", "G5"], ["C3", "C5"]); // => ["C4", "E4", "G4"]
 * Note.fold(["D", "G", "C"], ["E2", "D3"]); // => ["D3", "G2", "C3"]
 */
export function fold(
  notes: NoteName[],
  range: [low: NoteName, high: NoteName],
  options?: FoldOptions,
): string[] {
  if (!Array.isArray(notes) || notes.length === 0) return [];
  if (!Array.isArray(range) || range.length !== 2) return [];
  const [low, high] = range.map(props);
  const list = notes.map(props);
  const hasOctave = (n: Note) => !n.empty && n.oct !== undefined;
  if (!hasOctave(low) || !hasOctave(high) || low.height > high.height) {
    return [];
  }
  if (list.some((n) => n.empty)) return [];
  const move = (n: Note, octaves: number) =>
    octaves === 0 ? n.name : transposeOctaves(n.name, octaves);

  // one note on its own, by the fewest octaves
  const foldNote = (n: Note) => {
    const [from, to] = octavesInto(low.height, high.height, n.height, n.height);
    if (from <= to) return move(n, fewest(from, to));
    // no octave in the range: the nearest one, below or above it
    const below = low.height - (n.height + 12 * (from - 1));
    const above = n.height + 12 * from - high.height;
    return move(n, above <= below ? from : from - 1);
  };
  // a pitch class starts in the octave of `low`, so the fewest octaves from
  // there is the lowest octave at or above it
  const foldPitchClass = (n: Note) => foldNote(props(n.pc + low.oct));

  if (options?.each === true) {
    return list.map((n) => (hasOctave(n) ? foldNote(n) : foldPitchClass(n)));
  }
  const heights = list.filter(hasOctave).map((n) => n.height);
  const [from, to] = heights.length
    ? octavesInto(
        low.height,
        high.height,
        Math.min(...heights),
        Math.max(...heights),
      )
    : [0, 0];
  const octaves = from <= to ? fewest(from, to) : from;
  return list.map((n) => (hasOctave(n) ? move(n, octaves) : foldPitchClass(n)));
}

export type NoteComparator = (a: Note, b: Note) => number;

// Invalid notes compare as equal
const heightOf = (n: Note) =>
  n && typeof n.height === "number" ? n.height : NaN;

/** Options of `Note.nearest`. */
export type NearestOptions = {
  /**
   * "nearest" (default), or "up" or "down" for the nearest strictly above or
   * below the reference.
   */
  direction?: "nearest" | "up" | "down";
  /** The lowest and highest notes the result can be (both included). */
  range?: [low: NoteName, high: NoteName];
};

/**
 * Place a note near another: the octave of a note (or pitch class) nearest a
 * reference note, keeping its spelling. For a line built one note at a time,
 * where each note goes near the one before.
 *
 * - `direction: "nearest"` (the default): the nearest octave; a tritone either
 *   way goes up, and the reference's own pitch class stays in its octave.
 * - `direction: "up"` or `"down"`: the nearest strictly above or below, so the
 *   reference's own pitch class goes an octave away.
 * - `range`: the result is in `[low, high]`. When the direction has no octave
 *   in the range, the nearest octave in the range is used instead, so a line
 *   turns around at the edges; when the range has no octave of the note, the
 *   result is "".
 *
 * Only the pitch class of the note counts (`"Eb4"` is placed like `"Eb"`). It
 * returns "" if the note isn't valid, the reference has no octave, or the
 * range isn't two notes with octave from low to high.
 *
 * @param noteName - the note or pitch class to place
 * @param reference - the note to place it near, with octave
 * @param options - the direction and the range
 * @example
 * Note.nearest("Eb", "C3"); // => "Eb3"
 * Note.nearest("A", "C3"); // => "A2"
 * Note.nearest("A", "C3", { direction: "up" }); // => "A3"
 * Note.nearest("C", "C3", { direction: "up" }); // => "C4"
 * Note.nearest("D", "F1", { range: ["E1", "G3"], direction: "down" }); // => "D2"
 * ["E", "G", "B", "D"].reduce((line, pc) => [...line, Note.nearest(pc, line[line.length - 1])], ["C3"]); // => ["C3", "E3", "G3", "B3", "D4"]
 */
export function nearest(
  noteName: NoteName,
  reference: NoteName,
  options: NearestOptions = {},
): string {
  const n = props(noteName);
  const ref = props(reference);
  const direction = options.direction ?? "nearest";
  if (n.empty || ref.empty || ref.oct === undefined) return "";
  if (!["nearest", "up", "down"].includes(direction)) return "";
  let low = -Infinity;
  let high = Infinity;
  // two octaves either side: a spelling like B#2 or Cb3 crosses the octave
  let octaves = [ref.oct - 2, ref.oct + 2];
  if (options.range !== undefined) {
    const range = options.range;
    if (!Array.isArray(range) || range.length !== 2) return "";
    const [l, h] = range.map(props);
    if (l.empty || h.empty || l.oct === undefined || h.oct === undefined) {
      return "";
    }
    if (l.height > h.height) return "";
    low = l.height;
    high = h.height;
    octaves = [Math.min(ref.oct, l.oct) - 2, Math.max(ref.oct, h.oct) + 2];
  }
  // every octave of the note in the range, from low to high
  const candidates: Note[] = [];
  for (let oct = octaves[0]; oct <= octaves[1]; oct++) {
    const c = props(n.pc + oct);
    if (c.height >= low && c.height <= high) candidates.push(c);
  }
  const dist = (c: Note) => c.height - ref.height;
  const above = candidates.filter((c) => dist(c) > 0);
  const below = candidates.filter((c) => dist(c) < 0);
  const chosen =
    direction === "up" && above.length
      ? above[0]
      : direction === "down" && below.length
        ? below[below.length - 1]
        : candidates.reduce<Note | undefined>((best, c) => {
            if (!best) return c;
            const d = Math.abs(dist(c));
            const b = Math.abs(dist(best));
            return d < b || (d === b && dist(c) > 0) ? c : best;
          }, undefined);
  return chosen ? chosen.name : "";
}

/**
 * A comparator to sort Note objects (as returned by Note.get) from lowest to
 * highest. Invalid notes compare as equal to any other.
 *
 * @example
 * ["D4", "C4", "B3"].map(Note.get).sort(Note.ascending).map(n => n.name) // => ["B3", "C4", "D4"]
 */
export const ascending: NoteComparator = (a, b) =>
  heightOf(a) - heightOf(b) || 0;
/**
 * A comparator to sort Note objects (as returned by Note.get) from highest to
 * lowest.
 *
 * @example
 * ["D4", "C4", "B3"].map(Note.get).sort(Note.descending).map(n => n.name) // => ["D4", "C4", "B3"]
 */
export const descending: NoteComparator = (a, b) =>
  heightOf(b) - heightOf(a) || 0;

/**
 * Get the names of the valid notes sorted from lowest to highest (or with the
 * given comparator, see Note.descending). Invalid notes are removed.
 *
 * @example
 * Note.sortedNames(["D4", "C4", "x", "B3"]) // => ["B3", "C4", "D4"]
 * Note.sortedNames(["D4", "C4", "B3"], Note.descending) // => ["D4", "C4", "B3"]
 */
export function sortedNames(
  notes: any[],
  comparator?: NoteComparator,
): string[] {
  comparator = typeof comparator === "function" ? comparator : ascending;
  return onlyNotes(notes).sort(comparator).map(toName);
}

/**
 * Get the names of the valid notes sorted from lowest to highest, with
 * repeated names removed (enharmonic notes like C4 and B#3 are kept).
 * Invalid notes are removed.
 *
 * @example
 * Note.sortedUniqNames(["C4", "B#3", "D4", "C4", "x"]) // => ["C4", "B#3", "D4"]
 */
export function sortedUniqNames(notes: any[]): string[] {
  // Enharmonic notes (C4, B#3) have the same height, so the copies of a name
  // are not always next to each other after sorting.
  return Array.from(new Set(sortedNames(notes, ascending)));
}

/**
 * Get the simplest spelling of a note: at most one accidental, keeping sharps
 * if the note has sharps and flats otherwise. Returns "" if not valid.
 *
 * @function
 * @param {string} note - the note to be simplified
 * @return {string} the simplified note or '' if not valid note
 * @example
 * Note.simplify("C##") // => "D"
 * Note.simplify("C###") // => "D#"
 * Note.simplify("B#4") // => "C5"
 */
export const simplify = (noteName: NoteName | Pitch): string => {
  const note = get(noteName);
  if (note.empty) {
    return "";
  }
  const hasOctave = note.oct !== undefined;
  return midiToNoteName(hasOctave ? note.height : note.chroma, {
    sharps: note.alt > 0,
    pitchClass: !hasOctave,
  });
};
/**
 * Get an enharmonic spelling of a note (the same sound, written differently):
 * by default the one with the opposite accidental type, or the one with the
 * given destination pitch class. Returns "" if the note is not valid or the
 * destination is not enharmonic to it.
 *
 * @function
 * @param {string} note
 * @param {string} [destName] - optional destination pitch class
 * @return {string} the enharmonic note name or '' if not valid note
 * @example
 * Note.enharmonic("Db") // => "C#"
 * Note.enharmonic("C") // => "C"
 * Note.enharmonic("F2", "E#") // => "E#2"
 * Note.enharmonic("C##b") // => ""
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
      }),
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

/** @deprecated */
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
  distance,
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
  transposeOctaves,
  trFifths,
  simplify,
  enharmonic,
  fold,
  nearest,
};
