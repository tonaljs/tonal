/**
 * References:
 * - https://www.researchgate.net/publication/327567188_An_Algorithm_for_Spelling_the_Pitches_of_Any_Musical_Scale
 * @module scale
 */
import { get as getChord } from "@tonaljs/chord";
import { detect as detectChord } from "@tonaljs/chord-detect";
import { all as chordTypes, get as getChordType } from "@tonaljs/chord-type";
import { range as nums, rotate } from "@tonaljs/collection";
import { enharmonic, fromMidi, sortedUniqNames } from "@tonaljs/note";
import {
  chroma,
  isChroma,
  isSubsetOf,
  isSupersetOf,
  modes,
} from "@tonaljs/pcset";
import { tonicIntervalsTransposer, transpose } from "@tonaljs/pitch-distance";
import { note, NoteName } from "@tonaljs/pitch-note";
import {
  all,
  get as getScaleType,
  ScaleType,
  names as scaleTypeNames,
  all as scaleTypes,
} from "@tonaljs/scale-type";

type ScaleName = string;
type ScaleNameTokens = [string, string]; // [TONIC, SCALE TYPE]

export interface Scale extends ScaleType {
  tonic: string | null;
  type: string;
  notes: NoteName[];
}

const NoScale: Scale = {
  empty: true,
  name: "",
  type: "",
  tonic: null,
  setNum: NaN,
  chroma: "",
  normalized: "",
  aliases: [],
  notes: [],
  intervals: [],
  family: "",
  degree: 0,
};

/**
 * Split a scale name into `[tonic, type]`. The tonic is a normalized note name
 * (or `""` if there is no tonic) and the type is the rest of the name in
 * lower case, which can be any string: this function doesn't check that the
 * scale type exists. It never throws.
 *
 * @function
 * @param {string} name - the scale name
 * @return {Array} an array [tonic, type]
 * @example
 * Scale.tokenize("C mixolydian"); // => ["C", "mixolydian"]
 * Scale.tokenize("Cx major"); // => ["C##", "major"]
 * Scale.tokenize("anything is valid"); // => ["", "anything is valid"]
 * Scale.tokenize("C"); // => ["C", ""]
 */
export function tokenize(name: ScaleName): ScaleNameTokens {
  if (typeof name !== "string") {
    return ["", ""];
  }
  const i = name.indexOf(" ");
  const tonic = note(name.substring(0, i));
  if (tonic.empty) {
    const n = note(name);
    return n.empty ? ["", name.toLowerCase()] : [n.name, ""];
  }

  // the type starts after the space: the tonic name can be longer than the
  // text it was read from ("Cx" is "C##")
  const type = name.substring(i + 1).toLowerCase();
  return [tonic.name, type.length ? type : ""];
}

/**
 * Get the names of all the scale types in the dictionary. An alias of
 * `ScaleType.names`.
 * @function
 * @example
 * Scale.names().slice(0, 3); // => ["major pentatonic", "major", "minor"]
 */
export const names = scaleTypeNames;

/**
 * Get a scale from its name, as an object with `notes`, `intervals`, `name`,
 * `tonic`, `type`, `aliases` and `chroma`. The name is a tonic (with an
 * optional octave) followed by a scale type name or alias, or the tokens
 * `[tonic, type]`. Without a tonic the scale has intervals but no notes. It
 * returns `{ empty: true, ... }` if the scale type isn't in the dictionary.
 *
 * @example
 * Scale.get("C major").notes; // => ["C", "D", "E", "F", "G", "A", "B"]
 * Scale.get("C4 major").notes; // => ["C4", "D4", "E4", "F4", "G4", "A4", "B4"]
 * Scale.get(["D", "dorian"]).name; // => "D dorian"
 * Scale.get("major").intervals; // => ["1P", "2M", "3M", "4P", "5P", "6M", "7M"]
 * Scale.get("C nonsense").empty; // => true
 */
export function get(src: ScaleName | ScaleNameTokens): Scale {
  const tokens = Array.isArray(src) ? src : tokenize(src);
  const tonic = note(tokens[0]).name;
  const st = getScaleType(tokens[1]);
  if (st.empty) {
    return NoScale;
  }

  const type = st.name;
  const notes: string[] = tonic
    ? st.intervals.map((i) => transpose(tonic, i))
    : [];

  const name = tonic ? tonic + " " + type : type;

  return { ...st, name, type, tonic, notes };
}

/**
 * @deprecated Use Scale.get instead.
 */
export const scale = get;

/**
 * Find the names of the scales that contain a list of notes, best first. The
 * tonic is the first note, or `options.tonic`. A scale that has exactly the
 * notes comes first. With `match: "exact"` it's the only result (and the list
 * is empty if there is none); by default it's followed by the scales that
 * have the notes and more. It returns `[]` for no valid tonic.
 *
 * @param notes - the note names
 * @param options - `tonic` to use instead of the first note, and `match`
 * ("exact" or "fit", the default)
 *
 * @example
 * Scale.detect(["D", "E", "F", "G", "A", "B", "C"], { match: "exact" }); // => ["D dorian"]
 * Scale.detect(["C", "D", "E", "F", "G", "A", "B"], { tonic: "D", match: "exact" }); // => ["D dorian"]
 * Scale.detect(["C", "D", "E", "G", "A"], { match: "exact" }); // => ["C major pentatonic"]
 * Scale.detect(["C", "D", "E", "G"], { match: "exact" }); // => []
 */
export function detect(
  notes: string[],
  options: { tonic?: string; match?: "exact" | "fit" } = {},
): string[] {
  if (!Array.isArray(notes)) return [];
  const notesChroma = chroma(notes);
  const tonic = note(options.tonic ?? notes[0] ?? "");
  const tonicChroma = tonic.chroma;
  if (tonicChroma === undefined) {
    return [];
  }

  const pitchClasses = notesChroma.split("");
  pitchClasses[tonicChroma] = "1";
  const scaleChroma = rotate(tonicChroma, pitchClasses).join("");
  const match = all().find((scaleType) => scaleType.chroma === scaleChroma);

  const results: string[] = [];
  if (match) {
    results.push(tonic.name + " " + match.name);
  }
  if (options.match === "exact") {
    return results;
  }

  extended(scaleChroma).forEach((scaleName) => {
    results.push(tonic.name + " " + scaleName);
  });

  return results;
}

/**
 * Get the chord type symbols whose notes are all in a scale, without tonic.
 * It returns `[]` if the scale isn't valid. To get the chord built on each
 * degree, use `Scale.chords`.
 *
 * @function
 * @param {string} name - the scale name
 * @return {Array<string>} - the chord type symbols
 *
 * @example
 * Scale.scaleChords("pentatonic"); // => ["5", "M", "6", "sus2", "Madd9"]
 */
export function scaleChords(name: string): string[] {
  const s = get(name);
  const inScale = isSubsetOf(s.chroma);
  return chordTypes()
    .filter((chord) => inScale(chord.chroma))
    .map((chord) => chord.aliases[0]);
}
/**
 * Get the notes of a chord that aren't in a scale: the borrowed or chromatic
 * notes. Each is a pitch class spelled as in the chord, listed once, in the
 * chord order. The result is empty exactly when the chord fits the scale.
 *
 * The scale is a scale name with tonic or a list of notes, and the chord a
 * chord symbol or a list of notes. Enharmonic notes are the same note (`Gb`
 * is in a scale with `F#`). It returns `[]` if the scale or the chord isn't
 * valid.
 *
 * @example
 * Scale.outside("C major", "Bb7"); // => ["Bb", "Ab"]
 * Scale.outside("C major", "Fm"); // => ["Ab"]
 * Scale.outside("C major", "Dm7"); // => []
 * Scale.outside("A minor", ["E4", "G#4", "B4"]); // => ["G#"]
 * Scale.outside(["C", "D", "E", "G", "A"], "F"); // => ["F"]
 */
export function outside(
  scale: string | string[],
  chord: string | string[],
): string[] {
  const scaleNotes = Array.isArray(scale) ? scale : get(scale).notes;
  const chordNotes = Array.isArray(chord) ? chord : getChord(chord).notes;
  const inScale = chroma(scaleNotes);
  if (!inScale.includes("1")) return [];
  const seen = new Set<number>();
  return chordNotes
    .map((name) => note(name))
    .filter(({ empty, chroma }) => {
      if (empty || seen.has(chroma)) return false;
      seen.add(chroma);
      return inScale[chroma] === "0";
    })
    .map(({ pc }) => pc);
}

/**
 * Get the names of the scale types that have all the notes of a scale and at
 * least one more (the tonic is ignored). It returns `[]` if the scale isn't
 * valid. The opposite of `Scale.reduced`.
 *
 * @function
 * @param {string} name - the scale name, or a chroma
 * @return {Array} a list of scale type names
 * @example
 * Scale.extended("major"); // => ["bebop", "bebop major", "ichikosucho", "chromatic"]
 */
export function extended(name: string): string[] {
  const chroma = isChroma(name) ? name : get(name).chroma;
  const isSuperset = isSupersetOf(chroma);
  return scaleTypes()
    .filter((scale) => isSuperset(scale.chroma))
    .map((scale) => scale.name);
}

/**
 * Get the names of the scale types whose notes are all in a scale and are
 * fewer (the tonic is ignored). It returns `[]` if the scale isn't valid. The
 * opposite of `Scale.extended`.
 *
 * @function
 * @param {string} name - the scale name
 * @return {Array} a list of scale type names
 *
 * @example
 * Scale.reduced("major"); // => ["major pentatonic", "ionian pentatonic", "ritusen"]
 */
export function reduced(name: string): string[] {
  const isSubset = isSubsetOf(get(name).chroma);
  return scaleTypes()
    .filter((scale) => isSubset(scale.chroma))
    .map((scale) => scale.name);
}

/**
 * Turn a list of notes into a scale: its unique pitch classes sorted from the
 * first note, which is the tonic. Octaves and repetitions are dropped, and
 * invalid notes are ignored.
 *
 * @function
 * @param {string[]} notes
 * @return {string[]} pitch classes with same tonic
 * @example
 * Scale.scaleNotes(["C4", "c3", "C5", "C4", "c4"]); // => ["C"]
 * Scale.scaleNotes(["D4", "c#5", "A5", "F#6"]); // => ["D", "F#", "A", "C#"]
 */
export function scaleNotes(notes: NoteName[]) {
  if (!Array.isArray(notes)) return [];
  const pcset: string[] = notes.map((n) => note(n).pc).filter((x) => x);
  const tonic = pcset[0];
  const scale = sortedUniqNames(pcset);
  return rotate(scale.indexOf(tonic), scale);
}

type ScaleMode = [string, string];
/**
 * Get the modes of a scale (its rotations) that have a name in the dictionary,
 * as `[tonic, scale type name]` pairs. The tonics are note names, or intervals
 * if the scale has no tonic. It returns `[]` if the scale isn't valid.
 *
 * @function
 * @param {string} name - scale name
 * @example
 * Scale.modeNames("C pentatonic"); // => [["C", "major pentatonic"], ["D", "egyptian"], ["E", "malkos raga"], ["G", "ritusen"], ["A", "minor pentatonic"]]
 */
export function modeNames(name: string): ScaleMode[] {
  const s = get(name);
  if (s.empty) {
    return [];
  }

  const tonics = s.tonic ? s.notes : s.intervals;
  return modes(s.chroma)
    .map((chroma: string, i: number): ScaleMode => {
      const modeName = get(chroma).name;
      return modeName ? [tonics[i], modeName] : ["", ""];
    })
    .filter((x) => x[0]);
}

function getNoteNameOf(scale: string | string[]) {
  const names = Array.isArray(scale) ? scaleNotes(scale) : get(scale).notes;
  const chromas = names.map((name) => note(name).chroma);

  return (noteOrMidi: string | number): string | undefined => {
    const currNote =
      typeof noteOrMidi === "number"
        ? note(fromMidi(noteOrMidi))
        : note(noteOrMidi);
    const height = currNote.height;

    if (height === undefined) return undefined;
    const chroma = height % 12;
    const position = chromas.indexOf(chroma);
    if (position === -1) return undefined;
    return enharmonic(currNote.name, names[position]);
  };
}

/**
 * Get a function that lists the scale notes between two notes, both included.
 * The notes are spelled as in the scale. The function takes two note names
 * with octave and returns `[]` if one isn't valid. The scale
 * is a name or a list of notes.
 *
 * @example
 * Scale.rangeOf("C pentatonic")("C4", "C5"); // => ["C4", "D4", "E4", "G4", "A4", "C5"]
 * Scale.rangeOf(["C", "D", "E"])("C4", "E5"); // => ["C4", "D4", "E4", "C5", "D5", "E5"]
 * Scale.rangeOf("C major")("C4", "x"); // => []
 */
export function rangeOf(scale: string | string[]) {
  const getName = getNoteNameOf(scale);
  return (fromNote: string, toNote: string) => {
    const from = note(fromNote).height;
    const to = note(toNote).height;
    if (from === undefined || to === undefined) return [];

    return nums(from, to)
      .map(getName)
      .filter((x) => x);
  };
}

/**
 * A scale degree or step: a whole number, or a string with the number
 * followed by accidentals, like `"7b"`, `"4#"` or `"-2b"`. The number counts
 * scale notes, so `"7b"` is the 7th scale note lowered. A string with the
 * accidentals in front, like `"b7"`, is an interval name (as in
 * `Chord.noteOf`), not a scale step.
 */
export type ScaleStep = number | string;

const STEP_REGEX = /^(-?\d+)(#+|b+|)$/;

// [number, alteration] of a scale degree or step, or undefined if not valid
function parseStep(step: ScaleStep): [number, number] | undefined {
  if (typeof step === "number") {
    return Number.isInteger(step) ? [step, 0] : undefined;
  }
  const m = typeof step === "string" ? STEP_REGEX.exec(step) : null;
  if (!m) return undefined;
  const alt = m[2][0] === "b" ? -m[2].length : m[2].length;
  return [Number(m[1]), alt];
}

// Raise or lower a note by chromatic semitones, keeping its letter
function alter(noteName: string, alt: number): string {
  return alt === 0 ? noteName : transpose(noteName, [7 * alt, -4 * alt]);
}

/**
 * Get a function that returns the note of a scale by its degree, 1 being the
 * tonic (use `Scale.steps` for 0-based). The function returns `""` for degree
 * 0, an invalid degree or a scale without tonic.
 *
 * Degrees start at 1, and negative degrees go down from the tonic. A degree
 * can be a string with accidentals after the number (`"7b"`, `"4#"`, `"-2b"`):
 * the scale degree raised or lowered, keeping its letter.
 *
 * @example
 * [1, 2, 3].map(Scale.degrees("C major")); // => ["C", "D", "E"]
 * [1, 2, 3].map(Scale.degrees("C4 major")); // => ["C4", "D4", "E4"]
 * Scale.degrees("C major")("7b"); // => "Bb"
 * Scale.degrees("A major")("7b"); // => "G"
 */
export function degrees(scaleName: string | ScaleNameTokens) {
  const { intervals, tonic } = get(scaleName);
  const transpose = tonicIntervalsTransposer(intervals, tonic);
  return (degree: ScaleStep): string => {
    const step = parseStep(degree);
    if (!step || step[0] === 0) return "";
    const [num, alt] = step;
    return alter(transpose(num > 0 ? num - 1 : num), alt);
  };
}

/**
 * Get a function that returns the note of a scale by its step, 0 being the
 * tonic. It's `Scale.degrees` with 0-based index: negative steps go down, and
 * the accidental syntax is the same. The function returns `""` for an invalid
 * step or a scale without tonic.
 *
 * @example
 * [-1, 0, 1].map(Scale.steps("C4 major")); // => ["B3", "C4", "D4"]
 * Scale.steps("C major")("6b"); // => "Bb"
 */
export function steps(scaleName: string | ScaleNameTokens) {
  const { intervals, tonic } = get(scaleName);
  const transpose = tonicIntervalsTransposer(intervals, tonic);
  return (step: ScaleStep): string => {
    const parsed = parseStep(step);
    return parsed ? alter(transpose(parsed[0]), parsed[1]) : "";
  };
}

// The steps of a scale counted from its tonic in octave 4, and a function to
// find the step closest to a note height (ties go up) with its distance
function scaleStepper(scaleName: string | ScaleNameTokens) {
  const { intervals, tonic } = get(scaleName);
  const pc = note(tonic ?? "").pc;
  if (!pc || !intervals.length) return undefined;
  const ref = pc + "4";
  const refHeight = note(ref).height;
  const len = intervals.length;
  const stepName = tonicIntervalsTransposer(intervals, ref);

  const closest = (height: number): [step: number, distance: number] => {
    const base = Math.floor((height - refHeight) / 12) * len;
    let best = base;
    let dist = Infinity;
    for (let step = base - 1; step <= base + len; step++) {
      const d = note(stepName(step)).height - height;
      if (Math.abs(d) < Math.abs(dist) || (d === -dist && d > 0)) {
        best = step;
        dist = d;
      }
    }
    return [best, dist];
  };
  return { stepName, closest };
}

// The height of a note: pitch classes are placed in octave 4
function heightOf(n: { pc: string; oct?: number; height: number }) {
  return n.oct === undefined ? note(n.pc + "4").height : n.height;
}

/**
 * Transpose a note of the scale by a number of scale steps.
 *
 * The note can be a pitch class or have an octave, and the result is the same.
 * Enharmonic notes are the same note (`B#3` is the `C4` of C major), and the
 * result is spelled as in the scale. A note that isn't in the scale, or a
 * scale without tonic, gives an empty string: use `Scale.nearest` to move a
 * note into the scale first.
 *
 * @example
 * Scale.transposeBySteps("C major", "E4", 2); // => "G4"
 * Scale.transposeBySteps("C major", "E4", -3); // => "B3"
 * Scale.transposeBySteps("C major", "E", 2); // => "G"
 * Scale.transposeBySteps("C major", "F#4", 1); // => ""
 */
export function transposeBySteps(
  scaleName: string | ScaleNameTokens,
  noteName: string,
  steps: number,
): string {
  const n = note(noteName);
  const stepper = scaleStepper(scaleName);
  if (n.empty || !stepper || !Number.isInteger(steps)) return "";
  const [step, dist] = stepper.closest(heightOf(n));
  if (dist !== 0) return "";
  const name = stepper.stepName(step + steps);
  return n.oct === undefined ? note(name).pc : name;
}

/**
 * Find the scale note closest to a note, by pitch.
 *
 * A note halfway between two scale notes goes up, so `F#4` and `Gb4` both
 * give `G4` in C major. The result is spelled as in the scale, and it's a
 * pitch class if the note is a pitch class. A scale without tonic gives an
 * empty string.
 *
 * @example
 * Scale.nearest("C major", "F#4"); // => "G4"
 * Scale.nearest("C major", "Gb4"); // => "G4"
 * Scale.nearest("C major", "Eb"); // => "E"
 * Scale.nearest("C major", "B#3"); // => "C4"
 * Scale.nearest("C minor pentatonic", "D4"); // => "Eb4"
 */
export function nearest(
  scaleName: string | ScaleNameTokens,
  noteName: string,
): string {
  const n = note(noteName);
  const stepper = scaleStepper(scaleName);
  if (n.empty || !stepper) return "";
  const [step] = stepper.closest(heightOf(n));
  const name = stepper.stepName(step);
  return n.oct === undefined ? note(name).pc : name;
}

/**
 * A chord built on a scale degree: its notes, stacked from the scale, and its
 * chord symbol.
 */
export interface ScaleChord {
  /** The scale degree of the root, from 1 */
  degree: number;
  /** The notes, with octaves if the scale tonic has one */
  notes: string[];
  /** The chord symbol, or `""` when no chord type has these notes */
  symbol: string;
}

export type ScaleChordsOptions = {
  /** Notes per chord (3 by default: triads) */
  size: number;
  /** Scale steps between chord notes: 2 (thirds, the default), 3 (fourths) or 1 (seconds) */
  step: number;
};

/**
 * Get the chord built on each degree of a scale, by stacking scale notes.
 *
 * The symbol is the chord type whose intervals spell the notes (Eb G B D is
 * `Ebmaj7#5`, not `EbM7b6`). When no type spells them, it's a type with the
 * same notes over the same root, which can spell a note differently: the
 * diminished scale's Eb Gb A is `Ebdim`. A major triad is written without
 * quality (`C`), as in `Key`. A scale without tonic gives an empty list.
 *
 * It stacks the scale notes, so the melodic minor tonic is `CmMaj7`, while
 * `Key.minorKey("C").melodic.chords` lists the `Cm6` used in jazz.
 *
 * @example
 * Scale.chords("C major").map((c) => c.symbol); // => ["C", "Dm", "Em", "F", "G", "Am", "Bdim"]
 * Scale.chords("C major", { size: 4 })[6]; // => { degree: 7, notes: ["B", "D", "F", "A"], symbol: "Bm7b5" }
 * Scale.chords("C4 major")[4].notes; // => ["G4", "B4", "D5"]
 * Scale.chords("C major", { size: 4, step: 3 })[1].notes; // => ["D", "G", "C", "F"]
 */
export function chords(
  scaleName: string | ScaleNameTokens,
  options: Partial<ScaleChordsOptions> = {},
): ScaleChord[] {
  const { size = 3, step = 2 } = options;
  const { intervals, tonic, empty } = get(scaleName);
  if (empty || !tonic || !isCount(size) || !isCount(step)) return [];
  const stepName = steps(scaleName);

  return intervals.map((_, index) => {
    const notes = nums(0, size - 1).map((i) => stepName(index + i * step));
    return { degree: index + 1, notes, symbol: chordSymbol(notes) };
  });
}

const isCount = (n: number) => Number.isInteger(n) && n > 0;

// The best name of the notes over their first note, without the "M" of a
// major triad
function chordSymbol(notes: string[]): string {
  const root = note(notes[0]).pc;
  const symbol = detectChord(notes, { missingFifth: false }).find(
    (name) => !name.includes("/"),
  );
  if (!symbol) return "";
  const type = symbol.slice(root.length);
  return getChordType(type).name === "major" ? root : symbol;
}

/** @deprecated */
/** The approach notes to a target: see `Scale.approaches`. */
export interface ApproachNotes {
  /** A half step below: the leading tone. */
  below: string;
  /** A half step above. */
  above: string;
  /** The nearest scale note below the target. */
  scaleBelow: string;
  /** The nearest scale note above the target. */
  scaleAbove: string;
  /** The target's fifth, a fourth below it. */
  dominantBelow: string;
  /** The target's fifth, a fifth above it. */
  dominantAbove: string;
  /** The scale note above, then the half step below. */
  enclosure: string[];
  /** The half step above, then the half step below. */
  chromaticEnclosure: string[];
  /** Two half steps up to the target: a whole step below, then a half step below. */
  doubleBelow: string[];
  /** Two half steps down to the target: a whole step above, then a half step above. */
  doubleAbove: string[];
}

const NoApproachNotes: ApproachNotes = {
  below: "",
  above: "",
  scaleBelow: "",
  scaleAbove: "",
  dominantBelow: "",
  dominantAbove: "",
  enclosure: [],
  chromaticEnclosure: [],
  doubleBelow: [],
  doubleAbove: [],
};

// Transpose, and respell a double sharp or flat
function approachNote(target: string, interval: string): string {
  const name = transpose(target, interval);
  return /bb|##/.test(name) ? enharmonic(name) : name;
}

/**
 * Get the notes that lead to a target note: a half step below or above, the
 * nearest scale note below or above, the target's fifth (its dominant), and
 * the two-note figures made of them. Each is a note with octave next to the
 * target; which one to play, and when, is up to the app.
 *
 * The half step below is the leading tone (`E#2` below `F#2`). The notes above
 * a half step or a whole step, and the fifths, are spelled from the target,
 * respelled only when they would need a double sharp or flat. The scale notes
 * are spelled as in the scale, and the target doesn't need to be in it. For
 * the scale of a chord in a key, use `Chord.chordScale`.
 *
 * It returns empty fields when the target has no octave or isn't valid; with
 * no valid scale (like `""`), only the scale notes and the enclosure are
 * empty.
 *
 * These are the most common ways a walking bass moves into a chord change:
 * in the FiloBass corpus of jazz bass lines (Riley and Dixon, ISMIR 2023),
 * from a half step below or above, a whole step above, or a fourth below.
 *
 * @param scaleName - the scale name with tonic, or "" for chromatic approaches only
 * @param target - the target note, with octave
 * @example
 * Scale.approaches("G mixolydian", "G2").below; // => "F#2"
 * Scale.approaches("G mixolydian", "G2").scaleBelow; // => "F2"
 * Scale.approaches("G mixolydian", "G2").dominantBelow; // => "D2"
 * Scale.approaches("G mixolydian", "G2").enclosure; // => ["A2", "F#2"]
 * Scale.approaches(Chord.chordScale("G7", { key: "C major" }), "G2").scaleAbove; // => "A2"
 */
export function approaches(
  scaleName: string | ScaleNameTokens,
  target: string,
): ApproachNotes {
  const n = note(target);
  if (n.empty || n.oct === undefined) return { ...NoApproachNotes };
  const name = n.name;
  const below = approachNote(name, "-2m");
  const above = approachNote(name, "2m");
  const stepper = scaleStepper(scaleName);
  let scaleBelow = "";
  let scaleAbove = "";
  if (stepper) {
    const [step, dist] = stepper.closest(n.height);
    scaleBelow = stepper.stepName(dist < 0 ? step : step - 1);
    scaleAbove = stepper.stepName(dist > 0 ? step : step + 1);
  }
  return {
    below,
    above,
    scaleBelow,
    scaleAbove,
    dominantBelow: approachNote(name, "-4P"),
    dominantAbove: approachNote(name, "5P"),
    enclosure: scaleAbove ? [scaleAbove, below] : [],
    chromaticEnclosure: [above, below],
    doubleBelow: [approachNote(name, "-2M"), below],
    doubleAbove: [approachNote(name, "2M"), above],
  };
}

export default {
  approaches,
  chords,
  degrees,
  detect,
  extended,
  get,
  modeNames,
  names,
  nearest,
  outside,
  rangeOf,
  reduced,
  scaleChords,
  scaleNotes,
  steps,
  tokenize,
  transposeBySteps,

  // deprecated
  scale,
};
