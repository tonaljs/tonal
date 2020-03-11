import { detect } from "@tonaljs/chord-detect";
import {
  all as chordTypes,
  ChordType,
  get as getChordType
} from "@tonaljs/chord-type";

import {
  deprecate,
  note,
  NoteName,
  tokenizeNote,
  transpose as transposeNote
} from "@tonaljs/core";

import { isSubsetOf, isSupersetOf, modes } from "@tonaljs/pcset";

import { all as scaleTypes } from "@tonaljs/scale-type";
export { detect } from "@tonaljs/chord-detect";

type ChordName = string;
type ChordNameTokens = [string, string]; // [TONIC, SCALE TYPE]

interface Chord extends ChordType {
  tonic: string | null;
  type: string;
  notes: NoteName[];
}

const NoChord: Chord = {
  empty: true,
  name: "",
  type: "",
  tonic: null,
  setNum: NaN,
  quality: "Unknown",
  chroma: "",
  normalized: "",
  aliases: [],
  notes: [],
  intervals: []
};

// 6, 64, 7, 9, 11 and 13 are consider part of the chord
// (see https://github.com/danigb/tonal/issues/55)
const NUM_TYPES = /^(6|64|7|9|11|13)$/;
/**
 * Tokenize a chord name. It returns an array with the tonic and chord type
 * If not tonic is found, all the name is considered the chord name.
 *
 * This function does NOT check if the chord type exists or not. It only tries
 * to split the tonic and chord type.
 *
 * @function
 * @param {string} name - the chord name
 * @return {Array} an array with [tonic, type]
 * @example
 * tokenize("Cmaj7") // => [ "C", "maj7" ]
 * tokenize("C7") // => [ "C", "7" ]
 * tokenize("mMaj7") // => [ null, "mMaj7" ]
 * tokenize("Cnonsense") // => [ null, "nonsense" ]
 */
export function tokenize(name: string): ChordNameTokens {
  const [letter, acc, oct, type] = tokenizeNote(name);
  if (letter === "") {
    return ["", name];
  }
  // aug is augmented (see https://github.com/danigb/tonal/issues/55)
  if (letter === "A" && type === "ug") {
    return ["", "aug"];
  }
  // see: https://github.com/tonaljs/tonal/issues/70
  if (!type && (oct === "4" || oct === "5")) {
    return [letter + acc, oct];
  }

  if (NUM_TYPES.test(oct)) {
    return [letter + acc, oct + type];
  } else {
    return [letter + acc + oct, type];
  }
}

/**
 * Get a Chord from a chord name.
 */
export function get(src: ChordName | ChordNameTokens): Chord {
  const { type, tonic } = findChord(src);

  if (!type || type.empty) {
    return NoChord;
  }

  const notes: string[] = tonic
    ? type.intervals.map(i => transposeNote(tonic, i))
    : [];
  const name = tonic ? tonic + " " + type.name : type.name;
  return { ...type, name, type: type.name, tonic: tonic || "", notes };
}

export const chord = deprecate("Chord.chord", "Chord.get", get);

function findChord(src: string | ChordNameTokens) {
  if (!src || !src.length) {
    return {};
  }
  const tokens = Array.isArray(src) ? src : tokenize(src);
  const tonic = note(tokens[0]).name;
  const type = getChordType(tokens[1]);

  if (!type.empty) {
    return { tonic, type };
  } else if (tonic && typeof src === "string") {
    return { tonic: "", type: getChordType(src) };
  } else {
    return {};
  }
}

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
  const [tonic, type] = tokenize(chordName);
  if (!tonic) {
    return name;
  }
  return transposeNote(tonic, interval) + type;
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
    .filter(scale => isChordIncluded(scale.chroma))
    .map(scale => scale.name);
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
    .filter(chord => isSuperset(chord.chroma))
    .map(chord => s.tonic + chord.aliases[0]);
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
    .filter(chord => isSubset(chord.chroma))
    .map(chord => s.tonic + chord.aliases[0]);
}

export default {
  get,
  detect,
  chordScales,
  extended,
  reduced,
  tokenize,
  transpose,
  // deprecate
  chord
};
