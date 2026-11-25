/* eslint-disable no-redeclare -- TypeScript overloads keep the legacy signatures of get and search until tonal 7 */
import Chord from "@tonaljs/chord";
import Interval from "@tonaljs/interval";
import Note from "@tonaljs/note";
import Range from "@tonaljs/range";
import VoiceLeading, {
  VoiceLeadingFunction,
  VoiceLeadingMetric,
} from "@tonaljs/voice-leading";
import Dictionary, { VoicingDictionary } from "@tonaljs/voicing-dictionary";
import {
  AnchorMode,
  arrangements,
  cost,
  NoteRange,
  passesAnchor,
  PlaceOptions,
  withBass,
} from "./place";
import { chordInfo, chooseTones, VoicingBass } from "./tones";

const defaultRange = ["C3", "C5"];
const defaultDictionary = Dictionary.all;
const defaultVoiceLeading = VoiceLeading.topNoteDiff;

export type { NoteRange, AnchorMode } from "./place";
export type { VoicingBass } from "./tones";

/**
 * How to voice a chord. Every option can be given for a whole progression
 * (`Voicing.sequence`) or for one chord.
 */
export type VoicingOptions = {
  /**
   * How many voices: a number, or a range for each voice from the bottom
   * (`[["C3", "G4"], ["G3", "C5"]]`). Default: the chord's notes not played by
   * a bass part.
   */
  voices?: number | NoteRange[];
  /**
   * The tensions to add beyond the symbol: a list of degrees (`["9", "13"]`),
   * or `"available"` for the ones that suit the chord's family. Default: none.
   */
  extensions?: string[] | "available";
  /**
   * Who plays the chord's bass note: `"none"` (default: the voicing has it at
   * the bottom when it's a slash chord), `"root"` (a bass part, the first note
   * of the voicing) or `"external"` (a bass player: the voicing leaves it out).
   */
  bass?: VoicingBass;
  /** The range of the voices (all of them with `bass: "none"`). Default `["C3", "C5"]`. */
  range?: NoteRange;
  /** The range of the bass part, with `bass: "root"`. Default `["C2", "C3"]`. */
  bassRange?: NoteRange;
  /** A fixed top note (a melody note) or a range for the top note. */
  top?: string | NoteRange;
  /** Exactly these chord degrees, like `["3", "7", "9"]`. */
  degrees?: string[];
  /** A note to place the voicing against, without context. */
  anchor?: string;
  /**
   * With `anchor`: `"below"` (default, top note at or below it), `"duck"`
   * (top note below it, without it), `"above"` (bottom note at or above it) or
   * `"root"` (the root at the bottom, at or above it).
   */
  mode?: AnchorMode;
  /** The voicing before, to lead from. */
  previous?: string[];
  /** How to measure the voice leading from `previous`. Default `"L1"`. */
  metric?: VoiceLeadingMetric;
  /** Skip voicings below the low interval limits. Default `true`. */
  lowIntervals?: boolean;
};

const DEFAULT_RANGE: NoteRange = ["C3", "C5"];
const DEFAULT_BASS_RANGE: NoteRange = ["C2", "C3"];

function searchVoicings(
  chord: string,
  options: VoicingOptions = {},
): string[][] {
  const info = chordInfo(chord);
  if (!info) return [];
  const ranges = Array.isArray(options.voices) ? options.voices : undefined;
  const voices = ranges ? ranges.length : options.voices;
  if (voices !== undefined && !(Number.isInteger(voices) && voices > 0)) {
    return [];
  }
  const tones = chooseTones(chord, {
    voices,
    extensions: options.extensions,
    bass: options.bass,
    degrees: options.degrees,
    lead: typeof options.top === "string" ? options.top : undefined,
  });
  const place: PlaceOptions = {
    range: options.range ?? DEFAULT_RANGE,
    ranges,
    top: options.top,
    bass: options.bass ?? "none",
    bassRange: options.bassRange ?? DEFAULT_BASS_RANGE,
    bassNote: info.chord.bass || info.chord.tonic || undefined,
    rootChroma: Note.chroma(info.chord.tonic ?? "") as number,
    family: info.family,
    guides: guideDegrees(info.degrees),
    lowIntervals: options.lowIntervals ?? true,
    previous: options.previous,
    metric: options.metric,
    anchor: options.anchor,
    mode: options.mode,
  };
  const candidates = tones
    .flatMap((t) => withBass(arrangements(t.notes, t.degrees, place), place))
    .filter((c) => passesAnchor(c, place));
  const ranked = candidates.map((c) => ({
    notes: c.notes,
    cost: cost(c, place),
    centroid: c.pitches.reduce((sum, p) => sum + p.midi, 0) / c.pitches.length,
    midis: c.notes.map((n) => Note.midi(n) ?? 0),
  }));
  ranked.sort(
    (a, b) =>
      a.cost - b.cost ||
      a.centroid - b.centroid ||
      compareMidis(a.midis, b.midis),
  );
  const seen = new Set<string>();
  return ranked
    .filter((r) => {
      const key = r.notes.join(" ");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((r) => r.notes);
}

// The 3rd (or the 4th, 2nd or 11th that replaces it) and the 7th (or 6th)
function guideDegrees(degrees: string[]): string[] {
  const num = (d: string) => +(d.match(/\d+$/)?.[0] ?? NaN);
  const find = (...nums: number[]) =>
    nums.map((n) => degrees.find((d) => num(d) === n)).find((d) => !!d);
  return [find(3, 4, 2, 11), find(7, 6)].filter((d): d is string => !!d);
}

function compareMidis(a: number[], b: number[]): number {
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i] !== b[i]) return a[i] - b[i];
  }
  return a.length - b.length;
}

/**
 * Get a voicing of a chord: a list of notes with octave, from the bottom. By
 * default it has the notes of the symbol, in root position, near the middle
 * of the range ["C3", "C5"]: `Voicing.get("C7")` is C, E, G and Bb. Options
 * choose the number of voices, the tensions, who plays the bass, the range,
 * the top note, and lead from a previous voicing. It returns `[]` if the
 * chord is not valid or no voicing fits.
 *
 * It's the first result of `Voicing.search`, where the rules are explained.
 * (Called with a range array as the second argument, it uses the old
 * dictionary voicings, which are deprecated: see the README.)
 *
 * @param chord - chord symbol, like "Cmaj7" or "C7/E"
 * @param options - voices, extensions, bass, range, bassRange, top, degrees, anchor, mode, previous, metric, lowIntervals
 * @example
 * Voicing.get("C7"); // => ["C4", "E4", "G4", "Bb4"]
 * Voicing.get("Dm7", { voices: 4, extensions: "available", bass: "external" }); // => ["F3", "A3", "C4", "E4"]
 * Voicing.get("G7", { voices: 4, extensions: "available", bass: "external", previous: ["F3", "A3", "C4", "E4"] }); // => ["F3", "A3", "B3", "E4"]
 */
export function get(chord: string, options?: VoicingOptions): string[];
export function get(
  chord: string,
  range?: string[],
  dictionary?: VoicingDictionary,
  voiceLeading?: VoiceLeadingFunction,
  lastVoicing?: string[],
): string[];
export function get(
  chord: string,
  options?: VoicingOptions | string[],
  ...legacy: unknown[]
): string[] {
  if (Array.isArray(options) || legacy.length > 0) {
    return legacyGet(
      chord,
      (options as string[]) ?? defaultRange,
      (legacy[0] as VoicingDictionary) ?? defaultDictionary,
      (legacy[1] as VoiceLeadingFunction) ?? defaultVoiceLeading,
      legacy[2] as string[] | undefined,
    );
  }
  return searchVoicings(chord, options)[0] ?? [];
}

/**
 * Get every voicing of a chord that fits the options, best first. Each
 * voicing is a list of notes with octave, from the bottom. It returns `[]` if
 * the chord is not valid or no voicing fits.
 *
 * The rules, in four steps:
 *
 * 1. Tones. By default, the notes of the symbol. With fewer `voices`, the
 *    least important go first: the root and the natural 5th, never the 3rd
 *    and the 7th (`Chord.degreesByImportance`). `extensions` adds tensions:
 *    `"available"` gives the 9 that replaces the root on major, minor and
 *    dominant chords, the 13 that replaces the 5th on dominants, and extra
 *    colours (13 on major, 11 on minor) when there are voices left. When the
 *    3rd and the 7th, or the root and the 5th, tie for the last voice, both
 *    are tried. More voices than tones double the top note (with a fixed
 *    `top`), then the root, then the 5th.
 * 2. Placement: every arrangement inside the range (or the range of each
 *    voice), with neighbour voices at most an octave apart (a 10th for the
 *    lowest two), the top note and the slash bass where asked, and no
 *    interval below the low interval limits.
 * 3. Cost, lower first: the voice leading from `previous` (one per
 *    semitone); or the distance from the `anchor`; or a quarter per semitone
 *    from the centroid to the middle of the range, plus 12 when the chord's
 *    bass isn't at the bottom. Always: one per chord step beyond close
 *    position between neighbour voices, three per minor 9th between two
 *    notes (except the root under a b9 on a dominant), two per tension
 *    right below a chord tone more than a whole step away, and six when a
 *    bass part or a bass player has the root and the lowest voice isn't the
 *    3rd or the 7th (the "A" and "B" forms of rootless voicings).
 * 4. Ties: the lower voicing, then the lower notes.
 *
 * Sources: the tensions by family follow John Novello, *The Contemporary
 * Keyboardist* (tension substitutions), Mark Levine, *The Jazz Piano Book*
 * ch. 7, Rawlins & Bahha, *Jazzology* pp. 67-69, and Phil DeGreg, *Jazz
 * Keyboard Harmony* chs. 4-6. Doubling the lead and the root: Levine ch. 19,
 * Tim Richards, *Exploring Jazz Piano* vol. 1 p. 223, Bill Dobbins, *The
 * Contemporary Jazz Pianist* vol. 2 p. 11. The low interval limits and the
 * spread gaps: Gary Lindsay, *Jazz Arranging Techniques* chs. 12 and 16.
 * Spacing in chord steps: Dmitri Tymoczko, *Tonality: An Owner's Manual*,
 * prelude to ch. 2. Extensions not far below chord tones: Dobbins vol. 2 p. 11.
 * The 3rd or the 7th at the bottom of rootless voicings: Levine ch. 7,
 * *Jazzology* p. 67, Phil DeGreg chs. 4 and 6.
 *
 * @param chord - chord symbol, like "Cmaj7" or "C7/E"
 * @param options - see `Voicing.get`
 * @example
 * Voicing.search("C").slice(0, 2); // => [["C4", "E4", "G4"], ["C3", "E3", "G3"]]
 * Voicing.search("C7", { voices: 3 })[0]; // => ["C4", "E4", "Bb4"]
 * Voicing.search("C7", { bass: "root", voices: 3 })[0]; // => ["C2", "Bb3", "E4", "G4"]
 */
export function search(chord: string, options?: VoicingOptions): string[][];
export function search(
  chord: string,
  range?: string[],
  dictionary?: VoicingDictionary,
): string[][];
export function search(
  chord: string,
  options?: VoicingOptions | string[],
  dictionary?: VoicingDictionary,
): string[][] {
  if (Array.isArray(options) || dictionary !== undefined) {
    return legacySearch(
      chord,
      (options as string[]) ?? defaultRange,
      dictionary ?? defaultDictionary,
    );
  }
  return searchVoicings(chord, options);
}

// The dictionary voicings (before tonal 6.10), kept until tonal 7
/**
 * Get a voicing (a list of notes with octaves) of a chord symbol inside a
 * range. Without `lastVoicing` it picks the lowest voicing; with it, the
 * `voiceLeading` function picks the voicing that follows it best. Returns
 * `[]` if the chord is unknown or no voicing fits the range.
 *
 * @param chord - chord symbol, like "Cmaj7"
 * @param range - lowest and highest note, default ["C3", "C5"]
 * @param dictionary - voicing dictionary, default VoicingDictionary.all
 * @param voiceLeading - picks a voicing after lastVoicing, default VoiceLeading.topNoteDiff
 * @param lastVoicing - the previous voicing, if any
 * @example
 * Voicing.get("Cmaj7"); // => ["E3", "G3", "B3", "D4"]
 * Voicing.get("Dm7", ["C3", "C5"], undefined, undefined, ["C4", "E4", "G4", "B4"]); // => ["C4", "E4", "F4", "A4"]
 * Voicing.get("xx"); // => []
 */
function legacyGet(
  chord: string,
  range: string[] = defaultRange,
  dictionary = defaultDictionary,
  voiceLeading = defaultVoiceLeading,
  lastVoicing?: string[],
): string[] {
  const voicings = legacySearch(chord, range, dictionary);
  if (!voicings.length) {
    return [];
  }
  if (!lastVoicing || !lastVoicing.length) {
    // notes = voicings[Math.ceil(voicings.length / 2)]; // pick middle voicing..
    return voicings[0]; // pick lowest voicing..
  } else {
    // calculates the distance between the last note and the given voicings top note
    // sort voicings with differ
    return voiceLeading(voicings, lastVoicing) ?? [];
  }
}

/**
 * Get all the voicings of a chord symbol that fit inside a range: each
 * voicing of the dictionary, at every position in the range. Returns `[]` if the chord is not in the dictionary.
 *
 * @param chord - chord symbol, like "C"
 * @param range - lowest and highest note, default ["C3", "C5"]
 * @param dictionary - voicing dictionary, default VoicingDictionary.all
 * @example
 * Voicing.search("C", ["C3", "C5"], VoicingDictionary.triads).slice(0, 3); // => [["C3", "E3", "G3"], ["C4", "E4", "G4"], ["E3", "G3", "C4"]]
 */
function legacySearch(
  chord: string,
  range = defaultRange,
  dictionary = defaultDictionary,
): string[][] {
  const [tonic, symbol] = Chord.tokenize(chord);
  const sets = Dictionary.lookup(symbol, dictionary);
  // find equivalent symbol that is used as a key in dictionary:
  if (!sets) {
    return [];
  }
  // resolve array of interval arrays for the wanted symbol
  const voicings = sets.map((intervals) => intervals.split(" "));
  const notesInRange = Range.chromatic(range); // gives array of notes inside range
  return voicings.reduce((voiced: string[][], voicing: string[]) => {
    // transpose intervals relative to first interval (e.g. 3m 5P > 1P 3M)
    const relativeIntervals = voicing.map(
      (interval) => Interval.subtract(interval, voicing[0]) || "",
    );
    // get enharmonic correct pitch class the bottom note
    const bottomPitchClass = Note.transpose(tonic, voicing[0]);
    // get all possible start notes for voicing
    const starts = notesInRange
      // only get the start notes:
      .filter((note) => Note.chroma(note) === Note.chroma(bottomPitchClass))
      // filter out start notes that will overshoot the top end of the range
      .filter(
        (note) =>
          (Note.midi(
            Note.transpose(
              note,
              relativeIntervals[relativeIntervals.length - 1],
            ),
          ) || 0) <= (Note.midi(range[1]) || 0),
      )
      // replace Range.chromatic notes with the correct enharmonic equivalents
      .map((note) => Note.enharmonic(note, bottomPitchClass));
    // render one voicing for each start note
    const notes = starts.map((start) =>
      relativeIntervals.map((interval) => Note.transpose(start, interval)),
    );
    return voiced.concat(notes);
  }, []);
}

/**
 * Get a voicing for each chord of a list, each one voice-led from the
 * previous. A chord without voicing gives `[]` and the next chord is led from
 * the last chord that had one.
 *
 * @param chords - chord symbols, like ["Dm7", "G7", "Cmaj7"]
 * @param range - lowest and highest note, default ["C3", "C5"]
 * @param dictionary - voicing dictionary, default VoicingDictionary.all
 * @param voiceLeading - picks each voicing, default VoiceLeading.topNoteDiff
 * @param lastVoicing - the voicing before the first chord, if any
 * @example
 * Voicing.sequence(["Dm7", "G7", "Cmaj7"]); // => [["F3", "A3", "C4", "E4"], ["F3", "A3", "B3", "E4"], ["E3", "G3", "B3", "D4"]]
 */
export function sequence(
  chords: string[],
  range = defaultRange,
  dictionary = defaultDictionary,
  voiceLeading = defaultVoiceLeading,
  lastVoicing?: string[],
): string[][] {
  const { voicings } = chords.reduce<{
    voicings: string[][];
    lastVoicing: string[] | undefined;
  }>(
    ({ voicings, lastVoicing }, chord) => {
      const voicing = legacyGet(
        chord,
        range,
        dictionary,
        voiceLeading,
        lastVoicing,
      );
      // a chord without voicing gives [] and keeps its position, but the next
      // chord is still voice-led from the last chord that had a voicing
      if (voicing.length) {
        lastVoicing = voicing;
      }
      voicings.push(voicing);
      return { voicings, lastVoicing };
    },
    { voicings: [], lastVoicing },
  );
  return voicings;
}

/** @deprecated Use the named exports instead. */
export default {
  get,
  search,
  sequence,
};
