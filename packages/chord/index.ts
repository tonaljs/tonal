import { detect } from "@tonaljs/chord-detect";
import {
  ChordType,
  all as chordTypes,
  get as getChordType,
} from "@tonaljs/chord-type";
import { semitones, subtract } from "@tonaljs/interval";
import { isSubsetOf, isSupersetOf } from "@tonaljs/pcset";
import {
  distance,
  tonicIntervalsTransposer,
  transpose as transposeNote,
} from "@tonaljs/pitch-distance";
import { NoteName, note, tokenizeNote } from "@tonaljs/pitch-note";
import { all as scaleTypes } from "@tonaljs/scale-type";
import { composeChordType } from "./compose";
import {
  ChordDegreeName,
  degreeToInterval,
  intervalToDegree,
  probableDegree,
  sortByImportance,
} from "./degrees";

export type { ChordDegreeName } from "./degrees";

export { detect } from "@tonaljs/chord-detect";

type ChordNameOrTokens =
  | string // full name to be parsed
  | [string] // only the name
  | [string, string] // tonic, name
  | [string, string, string]; // tonic, name, bass
type ChordNameTokens = [string, string, string]; // [TONIC, SCALE TYPE, BASS]

export interface Chord extends ChordType {
  tonic: string | null;
  type: string;
  root: string;
  bass: string;
  rootDegree: number;
  symbol: string;
  notes: NoteName[];
}

const NoChord: Chord = {
  empty: true,
  name: "",
  symbol: "",
  root: "",
  bass: "",
  rootDegree: 0,
  type: "",
  tonic: null,
  setNum: NaN,
  quality: "Unknown",
  family: "",
  chroma: "",
  normalized: "",
  aliases: [],
  notes: [],
  intervals: [],
};

/**
 * "No chord", as `N.C.` is written in charts. Unlike an unknown symbol it
 * isn't empty, but it has no notes.
 */
const NoChordSymbol: Chord = {
  ...NoChord,
  empty: false,
  name: "no chord",
  symbol: "N.C.",
  type: "no chord",
  aliases: ["N.C.", "NC"],
};

const isNoChord = (name: string) => /^N\.?C\.?$/i.test(name);

// 6, 64, 7, 9, 11 and 13 are consider part of the chord
// (see https://github.com/danigb/tonal/issues/55)
//const NUM_TYPES = /^(6|64|7|9|11|13)$/;
/**
 * Tokenize a chord name. It returns an array with the tonic, chord type and bass
 * If not tonic is found, all the name is considered the chord name.
 *
 * This function does NOT check if the chord type exists or not. It only tries
 * to split the tonic and chord type.
 *
 * This function does NOT check if the bass is part of the chord or not but it
 * only accepts a pitch class as bass
 *
 * @function
 * @param {string} name - the chord name
 * @return {Array} an array with [tonic, type, bass]
 * @example
 * tokenize("Cmaj7") // => [ "C", "maj7", "" ]
 * tokenize("C7") // => [ "C", "7", "" ]
 * tokenize("mMaj7") // => [ "", "mMaj7", "" ]
 * tokenize("Cnonsense") // => [ "C", "nonsense", "" ]
 */
export function tokenize(name: string): ChordNameTokens {
  const [letter, acc, oct, type] = tokenizeNote(name);
  if (letter === "") {
    return tokenizeBass("", name);
  } else if (letter === "A" && type === "ug") {
    return tokenizeBass("", "aug");
  } else {
    return tokenizeBass(letter + acc, oct + type);
  }
}

function tokenizeBass(note: string, chord: string): ChordNameTokens {
  const split = chord.split("/");
  if (split.length === 1) {
    return [note, split[0], ""];
  }
  const [letter, acc, oct, type] = tokenizeNote(split[1]);
  // Only a pitch class is accepted as bass note
  if (letter !== "" && oct === "" && type === "") {
    return [note, split[0], letter + acc];
  } else {
    return [note, chord, ""];
  }
}

/**
 * Get a Chord from a chord name.
 */
export function get(src: ChordNameOrTokens): Chord {
  if (Array.isArray(src)) {
    return getChord(src[1] || "", src[0], src[2]);
  } else if (src === "") {
    return NoChord;
  } else {
    const [tonic, type, bass] = tokenize(src);
    const chord = getChord(type, tonic, bass);
    return chord.empty ? getChord(src) : chord;
  }
}

/**
 * Get chord properties
 *
 * @param typeName - the chord type name
 * @param [tonic] - Optional tonic
 * @param [root]  - Optional root (requires a tonic)
 */
export function getChord(
  typeName: string,
  optionalTonic?: string,
  optionalBass?: string,
): Chord {
  if (!optionalTonic && !optionalBass && isNoChord(typeName)) {
    return NoChordSymbol;
  }
  const listed = getChordType(typeName);
  // Symbols that aren't listed can be a listed type plus alterations
  const composed = listed.empty ? composeChordType(typeName) : undefined;
  const type = composed || listed;
  const tonic = note(optionalTonic || "");
  const bass = note(optionalBass || "");

  if (
    type.empty ||
    (optionalTonic && tonic.empty) ||
    (optionalBass && bass.empty)
  ) {
    return NoChord;
  }

  const bassInterval = distance(tonic.pc, bass.pc);
  const bassIndex = type.intervals.indexOf(bassInterval);
  const hasRoot = bassIndex >= 0;
  const root = hasRoot ? bass : note("");
  const rootDegree = bassIndex === -1 ? NaN : bassIndex + 1;
  const hasBass = bass.pc && bass.pc !== tonic.pc;

  const intervals = Array.from(type.intervals);

  if (hasRoot) {
    for (let i = 1; i < rootDegree; i++) {
      const num = intervals[0][0];
      const quality = intervals[0][1];
      const newNum = parseInt(num, 10) + 7;
      intervals.push(`${newNum}${quality}`);
      intervals.shift();
    }
  } else if (hasBass) {
    const ivl = subtract(distance(tonic.pc, bass.pc), "8P");
    if (ivl) intervals.unshift(ivl);
  }

  const notes = tonic.empty
    ? []
    : intervals.map((i) => transposeNote(tonic.pc, i));

  // A composed symbol is kept as written
  typeName =
    composed || type.aliases.indexOf(typeName) !== -1
      ? typeName
      : type.aliases[0];
  const symbol = `${tonic.empty ? "" : tonic.pc}${typeName}${
    hasRoot && rootDegree > 1 ? "/" + root.pc : hasBass ? "/" + bass.pc : ""
  }`;
  const name = `${optionalTonic ? tonic.pc + " " : ""}${type.name}${
    hasRoot && rootDegree > 1
      ? " over " + root.pc
      : hasBass
        ? " over " + bass.pc
        : ""
  }`;
  return {
    ...type,
    name,
    symbol,
    tonic: tonic.pc,
    type: type.name,
    root: root.pc,
    bass: hasBass ? bass.pc : "",
    intervals,
    rootDegree,
    notes,
  };
}

export const chord = get;

/**
 * Transpose a chord name
 *
 * @param {string} chordName - the chord name
 * @return {string} the transposed chord
 *
 * @example
 * transpose('Dm7', 'P4') // => 'Gm7
 */
export function transpose(chordName: string, interval: string): string {
  const [tonic, type, bass] = tokenize(chordName);
  if (!tonic) {
    return chordName;
  }
  const tr = transposeNote(bass, interval);
  const slash = tr ? "/" + tr : "";
  return transposeNote(tonic, interval) + type + slash;
}

/**
 * Get all scales where the given chord fits
 *
 * @example
 * chordScales('C7b9')
 * // => ["phrygian dominant", "flamenco", "spanish heptatonic", "half-whole diminished", "chromatic"]
 */
export function chordScales(name: string): string[] {
  const s = get(name);
  const isChordIncluded = isSupersetOf(s.chroma);
  return scaleTypes()
    .filter((scale) => isChordIncluded(scale.chroma))
    .map((scale) => scale.name);
}
/**
 * Get all chords names that are a superset of the given one
 * (has the same notes and at least one more)
 *
 * @function
 * @example
 * extended("CMaj7")
 * // => [ 'Cmaj#4', 'Cmaj7#9#11', 'Cmaj9', 'CM7add13', 'Cmaj13', 'Cmaj9#11', 'CM13#11', 'CM7b9' ]
 */
export function extended(chordName: string): string[] {
  const s = get(chordName);
  const isSuperset = isSupersetOf(s.chroma);
  return chordTypes()
    .filter((chord) => isSuperset(chord.chroma))
    .map((chord) => s.tonic + chord.aliases[0]);
}

/**
 * Find all chords names that are a subset of the given one
 * (has less notes but all from the given chord)
 *
 * @example
 */
export function reduced(chordName: string): string[] {
  const s = get(chordName);
  const isSubset = isSubsetOf(s.chroma);
  return chordTypes()
    .filter((chord) => isSubset(chord.chroma))
    .map((chord) => s.tonic + chord.aliases[0]);
}

/**
 * Return the chord notes
 */
export function notes(chordName: ChordNameOrTokens, tonic?: string): string[] {
  const chord = get(chordName);
  const note = tonic || chord.tonic;
  if (!note || chord.empty) return [];
  return chord.intervals.map((ivl) => transposeNote(note, ivl));
}

/**
 * Returns a function to get a note name from the scale degree.
 *
 * @example
 * [1, 2, 3, 4].map(Chord.degrees("C")) => ["C", "E", "G", "C"]
 * [1, 2, 3, 4].map(Chord.degrees("C4")) => ["C4", "E4", "G4", "C5"]
 */
export function degrees(chordName: ChordNameOrTokens, tonic?: string) {
  const chord = get(chordName);
  const note = tonic || tonicOf(chordName) || chord.tonic;
  const transpose = tonicIntervalsTransposer(chord.intervals, note);
  return (degree: number) =>
    degree ? transpose(degree > 0 ? degree - 1 : degree) : "";
}

/**
 * Sames as `degree` but with 0-based index
 */
export function steps(chordName: ChordNameOrTokens, tonic?: string) {
  const chord = get(chordName);
  const note = tonic || tonicOf(chordName) || chord.tonic;
  return tonicIntervalsTransposer(chord.intervals, note);
}

// The intervals of the chord type, before the bass rotates or extends them
function typeIntervals(chord: Chord): string[] {
  const ivls = chord.intervals;
  if (chord.rootDegree > 1) {
    const moved = ivls.length - (chord.rootDegree - 1);
    const lowered = ivls.slice(moved).map((ivl) => {
      const [, num, quality] = /^(\d+)(.*)$/.exec(ivl) || [];
      return `${+num - 7}${quality}`;
    });
    return [...lowered, ...ivls.slice(0, moved)];
  }
  return chord.bass ? ivls.slice(1) : ivls;
}

/**
 * Get the degrees of a chord, in the order of its intervals: its formula,
 * counted from the major scale of the root. The bass of a slash chord doesn't
 * change it. A chord tone is named after its interval in the chord type, so
 * the 6th of C6 is "6" and the 13th of C13 is "13".
 *
 * @example
 * Chord.degreeNames("Cm7"); // => ["1", "b3", "5", "b7"]
 * Chord.degreeNames("dim7"); // => ["1", "b3", "b5", "bb7"]
 * Chord.degreeNames("C13/E"); // => ["1", "3", "5", "b7", "9", "13"]
 */
export function degreeNames(chordName: ChordNameOrTokens): ChordDegreeName[] {
  const chord = get(chordName);
  return chord.empty ? [] : typeIntervals(chord).map(intervalToDegree);
}

/**
 * Get the degree a note plays in a chord, counted from the major scale of the
 * root (the bass of a slash chord doesn't change it).
 *
 * A chord tone gets its degree in the chord, whatever its spelling. Any other
 * note gets its most probable degree:
 *
 * - a minor second is "b9" and a major second "9"
 * - a minor third is "#9" over a major third, and "b3" otherwise
 * - a major third is "3"
 * - a fourth is "4" in a chord without third, and "11" otherwise
 * - an augmented fourth is "#11", a fifth "5" and a minor sixth "b13"
 * - a major sixth is "6" in a chord without seventh, and "13" otherwise
 * - a minor seventh is "b7" and a major seventh "7"
 *
 * `noteOf` gives the note back, spelled from the root. It returns "" if the
 * chord has no tonic or the note isn't valid.
 *
 * @example
 * Chord.degreeOf("C7b9", "Db"); // => "b9"
 * Chord.degreeOf("C7b9", "C#4"); // => "b9"
 * Chord.degreeOf("Cm", "Eb"); // => "b3"
 * Chord.degreeOf("C", "Eb"); // => "#9"
 * Chord.degreeOf("C7", "F"); // => "11"
 * Chord.degreeOf("C", "A"); // => "6"
 * Chord.degreeOf("C7", "A"); // => "13"
 */
export function degreeOf(
  chordName: ChordNameOrTokens,
  noteName: NoteName,
): ChordDegreeName {
  const chord = get(chordName);
  const tonic = note(chord.tonic || "");
  const n = note(noteName);
  if (chord.empty || tonic.empty || n.empty) return "";
  const dist = (n.chroma - tonic.chroma + 12) % 12;
  const ivls = typeIntervals(chord);
  const degrees = ivls.map(intervalToDegree);
  const index = ivls.findIndex((ivl) => semitones(ivl) % 12 === dist);
  return index !== -1 ? degrees[index] : probableDegree(dist, degrees);
}

/**
 * Get the note of a chord degree as a pitch class, spelled by transposing the
 * root. The degree is counted from the major scale of the root, as in chord
 * formulas: the third of Cm7 is "b3", and its "3" is "E".
 *
 * It returns "" if the chord has no tonic or the degree isn't valid.
 *
 * @example
 * Chord.noteOf("C7b9", "b9"); // => "Db"
 * Chord.noteOf("C#7", "b9"); // => "D"
 * Chord.noteOf("Cm7", "b3"); // => "Eb"
 * Chord.noteOf("Cdim7", "bb7"); // => "Bbb"
 */
export function noteOf(
  chordName: ChordNameOrTokens,
  degree: ChordDegreeName,
): NoteName {
  const chord = get(chordName);
  const ivl = degreeToInterval(degree);
  return chord.empty || !chord.tonic || !ivl
    ? ""
    : transposeNote(chord.tonic, ivl);
}

/**
 * Get the degrees of a chord sorted by how much they define it, to choose
 * which ones to keep when there are fewer voices than chord tones:
 *
 * 1. the third, or for chords without third the 4th, 2nd or 11th that
 *    replaces it
 * 2. the fifth, if it's altered
 * 3. the seventh, or the 6th for chords without seventh
 * 4. the first extension (the first degree not listed here)
 * 5. the root
 * 6. the fifth, if it's natural
 * 7. the other extensions
 *
 * @example
 * Chord.importance("C13"); // => ["3", "b7", "9", "1", "5", "13"]
 * Chord.importance("C7#5"); // => ["3", "#5", "b7", "1"]
 * Chord.importance("Csus4"); // => ["4", "1", "5"]
 * Chord.importance("m6"); // => ["b3", "6", "1", "5"]
 */
export function importance(chordName: ChordNameOrTokens): ChordDegreeName[] {
  return sortByImportance(degreeNames(chordName));
}

// When the chord is given as tokens, keep the tonic as written (with octave)
function tonicOf(chordName: ChordNameOrTokens): string | undefined {
  return Array.isArray(chordName) && chordName.length > 1
    ? chordName[0]
    : undefined;
}

/** @deprecated */
export default {
  getChord,
  get,
  detect,
  chordScales,
  extended,
  reduced,
  tokenize,
  transpose,
  degrees,
  steps,
  notes,
  chord,
  degreeNames,
  degreeOf,
  noteOf,
  importance,
};
