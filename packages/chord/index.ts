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
import { all as scaleTypes, get as getScaleType } from "@tonaljs/scale-type";
import { composeChordType } from "./compose";
import { fitDegreeIn } from "./fit";
import {
  ChordDegreeName,
  degreeToInterval,
  intervalToDegree,
  probableDegree,
  sortByImportance,
} from "./degrees";
import {
  COMMON_CHORD_SCALES,
  chromaPcs,
  clashes,
  degreePc,
  slotPcs,
  tensionsOf,
} from "./tensions";

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
  if (typeof name !== "string") return ["", "", ""];
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
  } else if (typeof src !== "string" || src === "") {
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
  if (typeof typeName !== "string") return NoChord;
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

/** Options of `Chord.chordScales` and `Chord.chordScale`. */
export interface ChordScaleOptions {
  /**
   * A key or scale name, like "C major", "A minor" or "A harmonic minor": the
   * scales are ranked by how well they fit it.
   */
  key?: string;
  /**
   * The chord's tensions, as degree names, instead of `Chord.tensions(chord)`.
   * They decide which scales agree with the chord.
   */
  tensions?: ChordDegreeName[];
}

/**
 * Get the names of the scale types that contain all the notes of a chord, as
 * type names without tonic. It returns `[]` if the chord isn't valid.
 *
 * Without options the list is in the order of the scale catalogue. With a
 * `key` it's ranked, and the first one is the chord's scale in that key
 * (`Chord.chordScale`):
 *
 * 1. the key's own mode on the chord's root, when it contains the chord;
 * 2. the common chord scales (the modes of major, melodic minor and harmonic
 *    minor, the two diminished scales and whole tone) that agree with the
 *    chord: none of their notes is another form of the chord's 3rd, 5th or 7th
 *    unless it's one of its tensions (so dorian #4, with a natural 5th, doesn't
 *    agree with m7b5);
 * 3. the common chord scales that don't agree with the chord;
 * 4. every other scale.
 *
 * Within each group: fewest notes outside the key first, then the scales of
 * seven notes, then the ones that share more notes with the key, then the
 * order of the list above (and the catalogue order). It returns `[]` if a key
 * is given and isn't valid, or the chord has no tonic.
 *
 * The rule ranks by notes, not by function: in a key every diatonic chord gets
 * the scale `Key` gives it, secondary dominants get mixolydian (to a major
 * chord) or phrygian dominant (to a minor chord), but a tritone substitute gets
 * phrygian dominant, not the lydian dominant the books give it.
 *
 * @param name - the chord symbol
 * @param options - the key, and the tensions to use instead of `Chord.tensions`
 * @example
 * Chord.chordScales("C7b9"); // => ["phrygian dominant", "flamenco", "phrygian b4", "mixolydian b2", "spanish heptatonic", "half-whole diminished", "chromatic"]
 * Chord.chordScales("D7", { key: "C major" }).slice(0, 3); // => ["mixolydian", "lydian dominant", "mixolydian b6"]
 * Chord.chordScales("E7", { key: "C major" })[0]; // => "phrygian dominant"
 */
export function chordScales(
  name: string,
  options?: ChordScaleOptions,
): string[] {
  const s = get(name);
  const isChordIncluded = isSupersetOf(s.chroma);
  const names = scaleTypes()
    .filter((scale) => isChordIncluded(scale.chroma))
    .map((scale) => scale.name);
  if (!options?.key) return names;
  return rankScales(name, names, options);
}

/**
 * Get the scale of a chord, as a full name: the first of its ranked chord
 * scales (see `Chord.chordScales`). It returns "" if the chord has no tonic,
 * the key isn't valid, or no scale contains the chord.
 *
 * Without a key the common chord scales that agree with the chord come first,
 * in the order of their list: so C7 gets mixolydian, Cm7b5 locrian and Cdim7
 * the whole-half diminished scale.
 *
 * @param name - the chord symbol
 * @param options - the key, and the tensions to use instead of `Chord.tensions`
 * @example
 * Chord.chordScale("Dm7", { key: "C major" }); // => "D dorian"
 * Chord.chordScale("D7", { key: "C major" }); // => "D mixolydian"
 * Chord.chordScale("A7", { key: "C major" }); // => "A mixolydian b6"
 * Chord.chordScale("Bdim7", { key: "C major" }); // => "B diminished"
 * Chord.chordScale("Cdim7"); // => "C diminished"
 */
export function chordScale(
  name: string,
  options: ChordScaleOptions = {},
): string {
  const chord = get(name);
  if (chord.empty || !chord.tonic) return "";
  const names = chordScales(name);
  const ranked = rankScales(name, names, options);
  return ranked.length ? `${chord.tonic} ${ranked[0]}` : "";
}

// The pitch classes (from the root) of a chord's tones, its tensions and slots
function chordPcs(name: string, tensions?: ChordDegreeName[]) {
  const chord = get(name);
  const root = note(chord.tonic || "");
  if (chord.empty || root.empty) return undefined;
  const f = formula(name);
  const tones = new Set(f.map(degreePc));
  const bass = note(chord.bass);
  if (!bass.empty) tones.add((bass.chroma - root.chroma + 12) % 12);
  const list = tensions ?? tensionsOf(f);
  return {
    root: root.chroma,
    tones,
    slots: slotPcs(f),
    tensions: new Set(list.map(degreePc).filter((pc) => pc >= 0)),
  };
}

// The pitch classes of a key or scale name ("C major"), from `from`
function keyPcs(key: string, from: number): number[] | undefined {
  const i = key.indexOf(" ");
  if (i === -1) return undefined;
  const tonic = note(key.slice(0, i));
  const type = getScaleType(key.slice(i + 1));
  if (tonic.empty || type.empty) return undefined;
  return chromaPcs(type.chroma, (from - tonic.chroma + 12) % 12);
}

function rankScales(
  name: string,
  names: string[],
  options: ChordScaleOptions,
): string[] {
  const pcs = chordPcs(name, options.tensions);
  if (!pcs) return [];
  const key = options.key ? keyPcs(options.key, pcs.root) : undefined;
  if (options.key && !key) return [];
  const inKey = new Set(key ?? []);
  const common = COMMON_CHORD_SCALES.map((n) => getScaleType(n).name);
  const ranked = names.map((scaleName, i) => {
    const scale = chromaPcs(getScaleType(scaleName).chroma);
    const out = key ? scale.filter((pc) => !inKey.has(pc)).length : 0;
    const order = common.indexOf(scaleName);
    // another form of the chord's 3rd, 5th or 7th that isn't a tension
    const agrees = !scale.some(
      (pc) => pcs.slots.has(pc) && !pcs.tones.has(pc) && !pcs.tensions.has(pc),
    );
    const own = key !== undefined && out === 0 && scale.length === inKey.size;
    const group = own ? 0 : order === -1 ? 3 : agrees ? 1 : 2;
    return {
      scaleName,
      group,
      out,
      notSeven: scale.length === 7 ? 0 : 1,
      shared: key ? scale.length - out : 0,
      order: order === -1 ? common.length + i : order,
    };
  });
  return ranked
    .sort(
      (a, b) =>
        a.group - b.group ||
        a.out - b.out ||
        a.notSeven - b.notSeven ||
        b.shared - a.shared ||
        a.order - b.order,
    )
    .map((r) => r.scaleName);
}

/**
 * Get the tensions of a chord: the notes a chord can add without changing
 * what it is, as degree names (`b9`, `9`, `#9`, `11`, `#11`, `b13`, `13`, and
 * `7` on 6, m6 and dim7 chords), counted from the major scale of the root as
 * in `Chord.formula`. It works with a chord type alone, and returns `[]` if
 * the chord isn't valid.
 *
 * The tensions come from a table by the chord's 3rd, 5th and 7th (from Ted
 * Pease, *Jazz Composition*, p. xv, and John Novello, *The Contemporary
 * Keyboardist*, p. 96):
 *
 * | Chord | Tensions |
 * |---|---|
 * | maj7, major triad | 9, #11, 13 |
 * | 6 | 9, #11, 7 |
 * | augmented, 7#5 | 9, #11 |
 * | 7 | b9, 9, #9, #11, b13, 13 |
 * | 7sus4 | b9, 9, 13 |
 * | mMaj7 | 9, 11, 13 |
 * | m6 | 9, 11, 7 |
 * | m7, minor triad | 9, 11 |
 * | m7b5, diminished triad | 9, 11, b13 |
 * | dim7 | 9, 11, b13, 7 |
 * | no 3rd | 9, 11, 13 |
 *
 * Then the ones the chord already says are left out: a tension with the
 * pitch class of a chord tone (C9 has no 9 tension, C7b5 no #11); over a major
 * 3rd, a written b9 or #9 leaves out the 9 and a written 9 leaves out b9 and
 * #9; a written 13 leaves out b13, and a written b13 leaves out 13.
 *
 * The 13 on m7 is a tension only in Dorian: `Chord.classify` takes it from a
 * key or scale. To use other tensions, pass them as the `tensions` option of
 * `classify`, `chordScales` and `chordScale`.
 *
 * @param name - the chord symbol or type
 * @example
 * Chord.tensions("C7"); // => ["b9", "9", "#9", "#11", "b13", "13"]
 * Chord.tensions("Cmaj7"); // => ["9", "#11", "13"]
 * Chord.tensions("C7b9"); // => ["#9", "#11", "b13", "13"]
 * Chord.tensions("m7"); // => ["9", "11"]
 * Chord.tensions("Cdim7"); // => ["9", "11", "b13", "7"]
 */
export function tensions(name: ChordNameOrTokens): ChordDegreeName[] {
  return tensionsOf(formula(name));
}

/** What a note is over a chord: see `Chord.classify`. */
export type NoteClass = "chord tone" | "tension" | "avoid" | "outside" | "";

/** Options of `Chord.classify`. */
export interface ClassifyOptions extends ChordScaleOptions {
  /** A scale name, like "D dorian": the notes it adds are tensions. */
  scale?: string;
}

/**
 * Get what a note is over a chord: a chord tone, a tension, an avoid note, or
 * outside. Only its pitch class counts. It returns "" if the chord has no
 * tonic, or the note, scale or key isn't valid.
 *
 * The rule, in order:
 *
 * 1. "chord tone": a note of the chord (the bass of a slash chord too).
 * 2. "avoid": a half step above a chord tone, or another form of the chord's
 *    3rd, 5th or 7th (the major 3rd over a minor chord, the 5th over a b5, the
 *    b7 over a maj7), unless it's one of the chord's tensions. So b9 on a
 *    dominant is a tension, and F on Cmaj7 is avoid.
 * 3. "tension": without a scale, one of `Chord.tensions`; with a scale, any
 *    other note of the scale.
 * 4. "outside": everything else (with a scale, a note not in it).
 *
 * The scale is `scale`, or the chord's scale in `key` (`Chord.chordScale`).
 * `tensions` is used instead of `Chord.tensions(chord)`, both for the avoid
 * exception and as the tensions without a scale.
 *
 * An avoid note is a note to handle with care, not a wrong one (Mark Levine,
 * *The Jazz Piano Book*): it works as a passing note, or resolving down.
 *
 * @param name - the chord symbol
 * @param noteName - the note or pitch class
 * @param options - a scale or a key, and the tensions to use
 * @example
 * Chord.classify("Cmaj7", "E"); // => "chord tone"
 * Chord.classify("C7", "Db"); // => "tension"
 * Chord.classify("Cmaj7", "F"); // => "avoid"
 * Chord.classify("Dm7", "B"); // => "outside"
 * Chord.classify("Dm7", "B", { key: "C major" }); // => "tension"
 * Chord.classify("Em7", "F", { key: "C major" }); // => "avoid"
 * Chord.classify("Dm7", "B", { tensions: ["9", "11", "13"] }); // => "tension"
 */
export function classify(
  name: string,
  noteName: string,
  options: ClassifyOptions = {},
): NoteClass {
  const pcs = chordPcs(name, options.tensions);
  const n = note(noteName);
  if (!pcs || n.empty) return "";
  const scaleName =
    options.scale ??
    (options.key
      ? chordScale(name, { key: options.key, tensions: options.tensions })
      : undefined);
  const scale =
    scaleName === undefined ? undefined : keyPcs(scaleName, pcs.root);
  if (scaleName !== undefined && !scale) return "";
  const pc = (n.chroma - pcs.root + 12) % 12;
  if (pcs.tones.has(pc)) return "chord tone";
  if (clashes(pc, pcs.tones, pcs.slots, pcs.tensions)) return "avoid";
  const available = scale ? new Set(scale) : pcs.tensions;
  return available.has(pc) ? "tension" : "outside";
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

/**
 * Get the bass note of a chord: the slash bass of a slash chord, or the root.
 * (`Chord.get(name).bass` is `""` when there's no slash.) With an octave, the
 * note is in that octave; to fit it into a range instead, use `Note.fold`.
 *
 * It returns `""` if the chord isn't valid or has no tonic, or if the octave
 * isn't an integer.
 *
 * @param chordName - the chord, like "C7/E"
 * @param octave - the octave of the note (optional)
 * @returns the bass note: a pitch class, or a note in the octave
 * @example
 * Chord.bass("C7/E"); // => "E"
 * Chord.bass("C7"); // => "C"
 * Chord.bass("C7/E", 2); // => "E2"
 */
export function bass(chordName: ChordNameOrTokens, octave?: number): string {
  const chord = get(chordName);
  const pc = note(chord.bass || chord.tonic || "").pc;
  if (chord.empty || !pc) return "";
  if (octave === undefined) return pc;
  return Number.isInteger(octave) ? pc + octave : "";
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
 * 2. the seventh, or the 6th for chords without seventh
 * 3. the fifth, if it's altered
 * 4. the extension that names the chord (the highest one), then the altered
 *    extensions
 * 5. the root
 * 6. the other extensions, implied by the one that names the chord
 * 7. the fifth, if it's natural
 *
 * So four voices of C13 are the root, 3rd, 7th and 13th, and without the root
 * (when a bass player has it) the 3rd, 7th, 13th and 9th.
 *
 * Sources, from jazz voicing practice:
 *
 * - Bill Dobbins, *The Contemporary Jazz Pianist*, vol. 2, p. 11: the 3rd and
 *   7th (or 3rd and 6th) carry the quality of a chord; the root and the
 *   natural 5th can go.
 * - Tim Richards, *Exploring Jazz Piano*: "dominant chords should never omit
 *   the seventh" (vol. 1, p. 226), and the three-note 13th chord is 7-3-13,
 *   without root and 5th (vol. 2, fig. 7.3).
 * - Mark Levine, *The Jazz Piano Book*, ch. 7: rootless voicings leave the
 *   root to the bass player.
 * - Phil DeGreg, *Jazz Keyboard Harmony*, chs. 4 and 6, and Dan Haerle, *Jazz
 *   Piano Voicing Skills*, skills 40-45: three- and four-note rootless
 *   voicings keep the 3rd and 7th, also on m7b5 and dim7.
 *
 * @example
 * Chord.degreesByImportance("C13"); // => ["3", "b7", "13", "1", "9", "5"]
 * Chord.degreesByImportance("Cm7b5"); // => ["b3", "b7", "b5", "1"]
 * Chord.degreesByImportance("C7#5"); // => ["3", "b7", "#5", "1"]
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

/** Options of `Chord.fitDegree` and `Chord.fitNote`. */
export interface FitOptions {
  /**
   * A scale name, like "F locrian": the chord's scale, which decides a role
   * the chord doesn't have before its tensions do.
   */
  scale?: string;
  /**
   * `fitNote` only: the root role goes to the target chord's slash bass (for
   * bass lines). Other roles don't change.
   */
  bass?: boolean;
}

// The degrees of a scale name ("F locrian"), counted from a root
function scaleDegrees(
  scaleName: string,
  root: string,
): ChordDegreeName[] | undefined {
  const i = scaleName.indexOf(" ");
  if (i === -1) return undefined;
  const tonic = note(scaleName.slice(0, i));
  const type = getScaleType(scaleName.slice(i + 1));
  if (tonic.empty || type.empty) return undefined;
  return type.intervals.map((ivl) =>
    intervalToDegree(distance(root, transposeNote(tonic.pc, ivl))),
  );
}

/**
 * Get the degree of a chord that plays the role of a degree from another
 * chord: the 3rd goes to the new 3rd, the 9th to a 9th the chord takes. Use it
 * to adapt a pattern written over one chord to another (see `Chord.fitNote`).
 * The number counts in the octave (9 and 2, 11 and 4, 13 and 6 are the same
 * role). The first rule that matches:
 *
 * 0. a chord tone stays, and so does a tension (`Chord.tensions`) when there's
 *    no `scale` or the scale has it: "7" on Cdim7, "#9" on C7b9;
 * 1. a chord tone with the same number: "3" is "b3" on Cm7, "7" is "bb7" on
 *    Cdim7, "11" is "4" on Csus4;
 * 2. a chord tone with the same pitch class: "#11" is "b5" on Cm7b5;
 * 3. with a `scale`, the scale note with the same number: "9" is "b9" with
 *    "C locrian" over Cm7b5;
 * 4. a tension with the same number (`Chord.tensions`): "11" is "#11" on C7,
 *    "13" is "b13" on Cm7b5, "b9" is "9" on Cm7;
 * 5. a 3rd on a chord without 3rd goes to its sus tone ("4" or "2");
 * 6. otherwise the degree stays: "13" on C7#5.
 *
 * Among several candidates, the same alteration wins, then the nearest in
 * semitones, ties up. It returns "" for an invalid degree, chord or scale.
 *
 * @param degree - a degree name, as `Chord.degreeOf` returns: "3", "b9", "#11"
 * @param to - the chord symbol (or type) to fit it to
 * @param options - `scale`: the chord's scale, like "C locrian"
 * @example
 * Chord.fitDegree("3", "Cm7"); // => "b3"
 * Chord.fitDegree("11", "F7"); // => "#11"
 * Chord.fitDegree("9", "Fm7b5"); // => "9"
 * Chord.fitDegree("9", "Fm7b5", { scale: "F locrian" }); // => "b9"
 * Chord.fitDegree("3", "F7sus4"); // => "4"
 */
export function fitDegree(
  degree: ChordDegreeName,
  to: ChordNameOrTokens,
  options: Pick<FitOptions, "scale"> = {},
): ChordDegreeName {
  if (typeof degree !== "string") return "";
  const f = formula(to);
  if (!f.length) return "";
  let scale: ChordDegreeName[] | undefined;
  if (options.scale) {
    const root = get(to).tonic || "C";
    scale = scaleDegrees(options.scale, root);
    if (!scale) return "";
  }
  return fitDegreeIn(degree, f, tensionsOf(f), scale);
}

/**
 * Fit a note from one chord to another: the note keeps its role (the 3rd
 * goes to the new 3rd, see `Chord.fitDegree`) and stays near its place. Use
 * it to play a pattern written over one chord (a bass line over C7) over any
 * other chord.
 *
 * 1. Its role in `from`: `Chord.degreeOf(from, note)`.
 * 2. The role in `to`: `Chord.fitDegree(role, to, { scale })`. With
 *    `bass: true`, the root role goes to the slash bass of `to`.
 * 3. Its octave: the note moves with the root, the nearest way (a tritone
 *    goes up), and the fitted note is the one nearest that, ties up.
 *
 * A pitch class gives a pitch class. It returns "" for an invalid note, or a
 * chord that isn't valid or has no tonic. The bass of `from` doesn't change
 * the roles: they count from the root.
 *
 * @param noteName - the note, like "E4"
 * @param from - the chord the note was written over, like "C7"
 * @param to - the chord to fit it to, like "Fm7b5"
 * @param options - `scale`: the scale of `to`; `bass`: the root goes to the slash bass
 * @example
 * Chord.fitNote("E4", "C7", "Fm7b5"); // => "Ab4"
 * Chord.fitNote("D4", "C7", "Fm7b5"); // => "G4"
 * Chord.fitNote("D4", "C7", "Fm7b5", { scale: "F locrian" }); // => "Gb4"
 * Chord.fitNote("F4", "C7", "Fmaj7"); // => "B4"
 * Chord.fitNote("C3", "C7", "F7/Eb", { bass: true }); // => "Eb3"
 * ["C3", "E3", "G3", "A3"].map((n) => Chord.fitNote(n, "C7", "Ebm7")); // => ["Eb3", "Gb3", "Bb3", "C4"]
 */
export function fitNote(
  noteName: NoteName,
  from: ChordNameOrTokens,
  to: ChordNameOrTokens,
  options: FitOptions = {},
): NoteName {
  const n = note(noteName);
  const source = get(from);
  const target = get(to);
  const fromRoot = note(source.tonic || "");
  const toRoot = note(target.tonic || "");
  if (n.empty || source.empty || target.empty || fromRoot.empty || toRoot.empty)
    return "";
  const role = degreeOf(from, n.name);
  const degree = fitDegree(role, to, options);
  if (!degree) return "";
  const pc =
    options.bass && degree === "1" && target.bass
      ? target.bass
      : noteOf(to, degree);
  if (!pc || n.height === undefined || n.oct === undefined) return pc;

  // the root motion, the nearest way: -5 to +6 semitones
  let motion = (((toRoot.chroma - fromRoot.chroma) % 12) + 12) % 12;
  if (motion > 6) motion -= 12;
  const moved = n.height + motion;
  // the octave of `pc` nearest `moved`, ties up
  const base = note(pc + "0").height;
  const below = Math.floor((moved - base) / 12);
  const lower = base + 12 * below;
  return pc + (lower + 12 - moved <= moved - lower ? below + 1 : below);
}

/** @deprecated */
export default {
  getChord,
  get,
  detect,
  chordScales,
  chordScale,
  tensions,
  classify,
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
  fitDegree,
  fitNote,
  degreesByImportance,
  bass,
};
