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
  complexity: 0,
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
 * Split a chord name into `[tonic, type, bass]`. Each part is a string that is
 * `""` when missing, and a name without tonic is all type. It never throws.
 *
 * It only splits the name: it doesn't check that the chord type exists, nor
 * that the bass is a chord note. The bass is only accepted as a pitch class.
 *
 * @function
 * @param {string} name - the chord name
 * @return {Array} an array with [tonic, type, bass]
 * @example
 * Chord.tokenize("Cmaj7"); // => ["C", "maj7", ""]
 * Chord.tokenize("Cmaj7/E"); // => ["C", "maj7", "E"]
 * Chord.tokenize("mMaj7"); // => ["", "mMaj7", ""]
 * Chord.tokenize("Cnonsense"); // => ["C", "nonsense", ""]
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
 * Get a chord from its symbol, as an object with `notes`, `intervals`,
 * `symbol`, `name`, `tonic`, `bass`, `quality` and more. The symbol can have a
 * tonic and a bass (`"C7/E"`), and the chord can be given as tokens
 * `[tonic, type, bass]`. Without a tonic, the chord has intervals but no notes.
 * It returns `{ empty: true, ... }` if the symbol isn't valid.
 *
 * A symbol that isn't listed can be a listed type with alterations
 * (`"Cm7b5b9"`, `"C7(b9,#9)"`, `"Co9"`), with or without spaces between them
 * (`"Cm7 b9"` is `"Cm7b9"`). `"N.C."` ("no chord") isn't empty but has no
 * notes.
 *
 * Use `Chord.getChord` when the type, tonic and bass are already separated.
 *
 * @example
 * Chord.get("Cmaj7").notes; // => ["C", "E", "G", "B"]
 * Chord.get("C7/E").notes; // => ["E", "G", "Bb", "C"]
 * Chord.get(["C", "maj7"]).symbol; // => "Cmaj7"
 * Chord.get("Cm7 b9").symbol; // => "Cm7b9"
 * Chord.get("Co9").notes; // => ["C", "Eb", "Gb", "Bbb", "D"]
 * Chord.get("nonsense").empty; // => true
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
 * Get a chord from a chord type name, an optional tonic and an optional bass.
 * It returns the same object as `Chord.get`, and `{ empty: true, ... }` if the
 * type, the tonic or the bass isn't valid. Unlike `Chord.get`, the type isn't
 * parsed from a symbol: `Chord.getChord("maj7", "C")` is `Chord.get("Cmaj7")`.
 *
 * @param typeName - the chord type name or alias, like "maj7"
 * @param [optionalTonic] - the tonic: without it the chord has no notes
 * @param [optionalBass] - the bass note, a pitch class (requires a tonic)
 *
 * @example
 * Chord.getChord("maj7", "C").notes; // => ["C", "E", "G", "B"]
 * Chord.getChord("maj7", "C", "E").notes; // => ["E", "G", "B", "C"]
 * Chord.getChord("maj7", "C", "E").symbol; // => "Cmaj7/E"
 * Chord.getChord("maj7").intervals; // => ["1P", "3M", "5P", "7M"]
 */
export function getChord(
  typeName: string,
  optionalTonic?: string,
  optionalBass?: string,
): Chord {
  if (!optionalTonic && !optionalBass && isNoChord(typeName)) {
    return NoChordSymbol;
  }
  let listed = getChordType(typeName);
  // Symbols that aren't listed can be a listed type plus alterations
  let composed = listed.empty ? composeChordType(typeName) : undefined;
  // Qualifiers can be separated by spaces, as in "m7 b9" or "min maj7"
  const compact = typeName.replace(/\s+/g, "");
  if (listed.empty && !composed && compact !== typeName) {
    typeName = compact;
    listed = getChordType(typeName);
    composed = listed.empty ? composeChordType(typeName) : undefined;
  }
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
  // A type without a long name (like "add9") is named by its symbol
  const tonicName = optionalTonic ? tonic.pc : "";
  const typeLabel = type.name
    ? `${tonicName ? tonicName + " " : ""}${type.name}`
    : tonicName + typeName;
  const name = `${typeLabel}${
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

/**
 * An alias of `Chord.get`, handy when importing from `@tonaljs/chord`.
 *
 * @example
 * Chord.chord("Dm7").symbol; // => "Dm7"
 */
export const chord = get;

/**
 * Transpose a chord symbol by an interval, keeping its type and transposing
 * its tonic and bass. It returns the symbol as is if it has no tonic (or isn't
 * a chord), so it doesn't check that the type is valid.
 *
 * @param {string} chordName - the chord symbol
 * @param {string} interval - the interval name, like "P4"
 * @return {string} the transposed chord symbol
 *
 * @example
 * Chord.transpose("Dm7", "P4"); // => "Gm7"
 * Chord.transpose("C/E", "M2"); // => "D/F#"
 * Chord.transpose("nonsense", "P4"); // => "nonsense"
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
 * Get the names of the scale types that contain all the notes of a chord, as
 * type names without tonic. It returns `[]` if the chord isn't valid.
 *
 * @example
 * Chord.chordScales("C7b9"); // => ["phrygian dominant", "flamenco", "spanish heptatonic", "half-whole diminished", "chromatic"]
 */
export function chordScales(name: string): string[] {
  const s = get(name);
  const isChordIncluded = isSupersetOf(s.chroma);
  return scaleTypes()
    .filter((scale) => isChordIncluded(scale.chroma))
    .map((scale) => scale.name);
}
/**
 * Get the symbols of the chords that have all the notes of a chord and at
 * least one more, on the same tonic. It returns `[]` if the chord isn't valid.
 * The opposite of `Chord.reduced`.
 *
 * @function
 * @example
 * Chord.extended("Cmaj7"); // => ["Cmaj#4", "Cmaj7#9", "Cmaj7#9#11", "Cmaj9", "Cmaj13", "CM7add13", "Cmaj9#11", "CM13#11", "Cmaj11", "CM7b9"]
 */
export function extended(chordName: string): string[] {
  const s = get(chordName);
  const isSuperset = isSupersetOf(s.chroma);
  return chordTypes()
    .filter((chord) => isSuperset(chord.chroma))
    .map((chord) => s.tonic + chord.aliases[0]);
}

/**
 * Get the symbols of the chords whose notes are all in a chord and are fewer,
 * on the same tonic. It returns `[]` if the chord isn't valid. The opposite
 * of `Chord.extended`.
 *
 * @example
 * Chord.reduced("Cmaj7"); // => ["C5", "CM"]
 * Chord.reduced("Cmaj9"); // => ["C5", "CM", "Cmaj7", "Csus2", "CMadd9"]
 */
export function reduced(chordName: string): string[] {
  const s = get(chordName);
  const isSubset = isSubsetOf(s.chroma);
  return chordTypes()
    .filter((chord) => isSubset(chord.chroma))
    .map((chord) => s.tonic + chord.aliases[0]);
}

/**
 * Get the notes of a chord, the same as `Chord.get(name).notes` (a slash
 * chord starts at its bass). The optional `tonic` replaces the chord's own
 * tonic, so a chord type name alone works, and a tonic with an octave gives
 * notes with octaves. It returns `[]` if the chord isn't valid or has no tonic.
 *
 * @example
 * Chord.notes("Cmaj7"); // => ["C", "E", "G", "B"]
 * Chord.notes("Cmaj7", "C4"); // => ["C4", "E4", "G4", "B4"]
 * Chord.notes("maj7", "D"); // => ["D", "F#", "A", "C#"]
 * Chord.notes("C/E"); // => ["E", "G", "C"]
 * Chord.notes("nonsense"); // => []
 */
export function notes(chordName: ChordNameOrTokens, tonic?: string): string[] {
  const chord = get(chordName);
  const note = tonic || chord.tonic;
  if (!note || chord.empty) return [];
  return chord.intervals.map((ivl) => transposeNote(note, ivl));
}

/**
 * Get a function that returns the note of a chord by its position, 1 being
 * the tonic. The position counts the chord notes, so the 3rd note of C is "G"
 * and the 4th is "C" an octave up. For the note of the degree named "3", see
 * `Chord.noteOf`; for positions starting at 0, `Chord.steps`.
 *
 * To get octaves, give the chord as tokens with the tonic octave. The
 * function returns `""` for 0 or if the chord isn't valid.
 *
 * @example
 * [1, 2, 3, 4].map(Chord.degrees("C")); // => ["C", "E", "G", "C"]
 * [1, 2, 3, 4].map(Chord.degrees(["C4", "M"])); // => ["C4", "E4", "G4", "C5"]
 * Chord.degrees("Cmaj7")(4); // => "B"
 */
export function degrees(chordName: ChordNameOrTokens, tonic?: string) {
  const chord = get(chordName);
  const note = tonic || tonicOf(chordName) || chord.tonic;
  const transpose = tonicIntervalsTransposer(chord.intervals, note);
  return (degree: number) =>
    degree ? transpose(degree > 0 ? degree - 1 : degree) : "";
}

/**
 * Get a function that returns the note of a chord by its position, 0 being the
 * tonic (like `Chord.degrees` but 0-based). Negative steps go down. The
 * function returns `""` if the chord isn't valid.
 *
 * To get octaves, give the chord as tokens with the tonic octave.
 *
 * @example
 * [0, 1, 2, 3].map(Chord.steps("C")); // => ["C", "E", "G", "C"]
 * [-1, 0, 1].map(Chord.steps(["C4", "M"])); // => ["G3", "C4", "E4"]
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
 * Get the formula of a chord: its degree names, in the order of its intervals,
 * counted from the major scale of the root. It returns `[]` if the chord isn't
 * valid.
 *
 * The bass of a slash chord doesn't change it. A chord tone is named after its interval in the chord type, so
 * the 6th of C6 is "6" and the 13th of C13 is "13".
 *
 * @example
 * Chord.formula("Cm7"); // => ["1", "b3", "5", "b7"]
 * Chord.formula("dim7"); // => ["1", "b3", "b5", "bb7"]
 * Chord.formula("C13/E"); // => ["1", "3", "5", "b7", "9", "13"]
 */
export function formula(chordName: ChordNameOrTokens): ChordDegreeName[] {
  const chord = get(chordName);
  return chord.empty ? [] : typeIntervals(chord).map(intervalToDegree);
}

/**
 * Get the degree name that a note plays in a chord, counted from the major
 * scale of the root (the bass of a slash chord doesn't change it). The
 * opposite of `Chord.noteOf`.
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
 * Get the note of a chord degree name as a pitch class, spelled by transposing
 * the root. The opposite of `Chord.degreeOf`. The degree is counted from the major scale of the root, as in chord
 * formulas: the third of Cm7 is "b3", and its "3" is "E".
 *
 * It returns "" if the chord has no tonic or the degree isn't a degree name
 * (a number like 3 isn't one).
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
  // A number is a position (see `steps`), not a degree name
  const ivl = typeof degree === "string" ? degreeToInterval(degree) : "";
  return chord.empty || !chord.tonic || !ivl
    ? ""
    : transposeNote(chord.tonic, ivl);
}

/**
 * Get the degree names of a chord (as in `Chord.formula`) sorted by how much
 * they define it, to choose which ones to keep when there are fewer voices
 * than chord tones. It returns `[]` if the chord isn't valid.
 *
 * The order is:
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
 * Chord.degreesByImportance("C13"); // => ["3", "b7", "9", "1", "5", "13"]
 * Chord.degreesByImportance("C7#5"); // => ["3", "#5", "b7", "1"]
 * Chord.degreesByImportance("Csus4"); // => ["4", "1", "5"]
 * Chord.degreesByImportance("m6"); // => ["b3", "6", "1", "5"]
 */
export function degreesByImportance(
  chordName: ChordNameOrTokens,
): ChordDegreeName[] {
  return sortByImportance(formula(chordName));
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
  formula,
  degreeOf,
  noteOf,
  degreesByImportance,
};
