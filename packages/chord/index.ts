import { detect } from "@tonaljs/chord-detect";
import {
  ChordType,
  all as chordTypes,
  get as getChordType,
} from "@tonaljs/chord-type";
import { subtract } from "@tonaljs/interval";
import { isSubsetOf, isSupersetOf } from "@tonaljs/pcset";
import {
  distance,
  tonicIntervalsTransposer,
  transpose as transposeNote,
} from "@tonaljs/pitch-distance";
import { NoteName, note, tokenizeNote } from "@tonaljs/pitch-note";
import { all as scaleTypes } from "@tonaljs/scale-type";

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
  chroma: "",
  normalized: "",
  aliases: [],
  notes: [],
  intervals: [],
};

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
 * tokenize("Cmaj7") // => [ "C", "maj7" ]
 * tokenize("C7") // => [ "C", "7" ]
 * tokenize("mMaj7") // => [ null, "mMaj7" ]
 * tokenize("Cnonsense") // => [ null, "nonsense" ]
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
  const type = getChordType(typeName);
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

  typeName = type.aliases.indexOf(typeName) !== -1 ? typeName : type.aliases[0];
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
  const note = tonic || chord.tonic;
  const transpose = tonicIntervalsTransposer(chord.intervals, note);
  return (degree: number) =>
    degree ? transpose(degree > 0 ? degree - 1 : degree) : "";
}

/**
 * Sames as `degree` but with 0-based index
 */
export function steps(chordName: ChordNameOrTokens, tonic?: string) {
  const chord = get(chordName);
  const note = tonic || chord.tonic;
  return tonicIntervalsTransposer(chord.intervals, note);
}

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
};
