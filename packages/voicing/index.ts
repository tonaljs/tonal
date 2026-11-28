/* eslint-disable no-redeclare -- TypeScript overloads keep the legacy signatures of get, search and sequence until tonal 7 */
import Chord from "@tonaljs/chord";
import Interval from "@tonaljs/interval";
import Note from "@tonaljs/note";
import Range from "@tonaljs/range";
import VoiceLeading, {
  VoiceLeadingFunction,
  VoiceLeadingMetric,
  path as voiceLeadingPath,
} from "@tonaljs/voice-leading";
import Dictionary, { VoicingDictionary } from "@tonaljs/voicing-dictionary";
import {
  AnchorMode,
  arrangements,
  cost,
  fits,
  NoteRange,
  passesAnchor,
  PlaceOptions,
  withBass,
} from "./place";
import { VoicingSpacing } from "./spacing";
import { placeForm, resolveForm, TEMPLATES, templateForms } from "./templates";
import { chordInfo, chooseTones, VoicingBass } from "./tones";

const defaultRange = ["C3", "C5"];
const defaultDictionary = Dictionary.all;
const defaultVoiceLeading = VoiceLeading.topNoteDiff;

export type { NoteRange, AnchorMode } from "./place";
export type { VoicingBass } from "./tones";
export type { VoicingSpacing } from "./spacing";
export { analyze, drop, invert, steps } from "./notes";
export type { VoicingAnalysis } from "./notes";

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
  /**
   * A voicing template: a name of tonal's catalogue (`Voicing.templates()`:
   * "rootless", "shell", "so-what", "upper-structure"…) or chord degrees from
   * the bottom, with `|` between the hands (`"R | 3-7-9"`). Each note is the
   * nearest pitch above the one below. With `voices`, only the forms with
   * that many notes; otherwise the largest forms that fit in the range. A
   * chord the template gives nothing for (no form for its family, as a
   * dominant with "so-what", or none that fits) is voiced by the rules. An
   * unknown template name gives `[]`.
   */
  template?: string | string[];
  /**
   * Only voicings with this spacing: `"close"`, `"open"`, `"drop2"`,
   * `"drop3"`, `"drop24"`, `"spread"`, `"block"` (close under the top note,
   * doubled an octave below), or the chord steps between neighbour voices
   * (`[2, 1, 2]` is drop 2 for four voices).
   */
  spacing?: VoicingSpacing;
};

const DEFAULT_RANGE: NoteRange = ["C3", "C5"];
const DEFAULT_BASS_RANGE: NoteRange = ["C2", "C3"];

type Ranked = { notes: string[]; cost: number };

// The voicings of a chord with their cost, best first
function rankVoicings(chord: string, options: VoicingOptions = {}): Ranked[] {
  const info = chordInfo(chord);
  if (!info) return [];
  const given = options.voices;
  const ranges = Array.isArray(given) ? given : undefined;
  const voices = Array.isArray(given) ? given.length : given;
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
    spacing: options.spacing,
    previous: options.previous,
    metric: options.metric,
    anchor: options.anchor,
    mode: options.mode,
  };
  // an unknown template name is an error, not a reason to use the rules
  if (
    typeof options.template === "string" &&
    !TEMPLATES[options.template] &&
    !/\d/.test(options.template)
  ) {
    return [];
  }
  // a template, or the rules when the template gives nothing for this chord
  const fromTemplate = options.template
    ? templateArrangements(chord, options.template, info.family, voices, place)
    : [];
  const upper = fromTemplate.length
    ? fromTemplate
    : tones.flatMap((t) => arrangements(t.notes, t.degrees, place));
  const candidates = upper.length
    ? withBass(upper, place).filter((c) => passesAnchor(c, place))
    : [];
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
    .map(({ notes, cost }) => ({ notes, cost }));
}

function searchVoicings(chord: string, options: VoicingOptions = {}) {
  return rankVoicings(chord, options).map((r) => r.notes);
}

/**
 * A chord of a sequence with its own options: the options of `Voicing.get`
 * except `previous` and `metric`, which belong to the whole sequence.
 */
export type VoicingChord = { chord: string } & Omit<
  VoicingOptions,
  "previous" | "metric"
>;

/** The options of `Voicing.sequence`. */
export type SequenceOptions = VoicingOptions & {
  /**
   * The largest move of a voice between two chords, in semitones. A voicing
   * that needs a larger move from every voicing the sequence can be at in the
   * chord before is skipped, unless every voicing of its chord does (then
   * none is skipped).
   */
  maxLeap?: number;
};

function sequenceVoicings(
  chords: (string | VoicingChord)[],
  options: SequenceOptions = {},
): string[][] {
  if (!Array.isArray(chords)) return [];
  const { previous, maxLeap, metric, ...shared } = options;
  const lists = chords.map((item) => {
    const { chord, ...own } =
      typeof item === "string" ? { chord: item } : (item ?? { chord: "" });
    // previous and metric belong to the whole sequence, not to one chord
    const merged: VoicingOptions = {
      ...shared,
      ...own,
      previous: undefined,
      metric: undefined,
    };
    return rankVoicings(chord ?? "", merged);
  });
  return voiceLeadingPath(
    lists.map((list) => list.map((r) => r.notes)),
    {
      metric,
      previous,
      maxLeap,
      costs: lists.map((list) => list.map((r) => r.cost)),
    },
  ).voicings;
}

// The 3rd (or the 4th, 2nd or 11th that replaces it) and the 7th (or 6th)
function guideDegrees(degrees: string[]): string[] {
  const num = (d: string) => +(d.match(/\d+$/)?.[0] ?? NaN);
  const find = (...nums: number[]) =>
    nums.map((n) => degrees.find((d) => num(d) === n)).find((d) => !!d);
  return [find(3, 4, 2, 11), find(7, 6)].filter((d): d is string => !!d);
}

// The arrangements of a voicing template for a chord
function templateArrangements(
  chord: string,
  template: string | string[],
  family: string,
  voices: number | undefined,
  place: PlaceOptions,
) {
  const forms = templateForms(template, family)
    .map((form) => resolveForm(chord, form))
    .filter((f): f is NonNullable<typeof f> => !!f);
  if (!forms.length) return [];
  const ranges = place.ranges;
  const low = Note.midi(ranges ? ranges[0][0] : place.range[0]);
  const high = Note.midi(
    ranges ? ranges[ranges.length - 1][1] : place.range[1],
  );
  if (low === null || high === null) return [];
  // a template sets its own gaps (a root far below the right hand)
  const rules = { ...place, gaps: false };
  const placed = (size: number) =>
    forms
      .filter((f) => f.length === size)
      .flatMap((f) => placeForm(f, low, high))
      .filter((p) => fits(p, rules));
  if (voices !== undefined) return placed(voices);
  // without voices: the largest forms that fit
  const sizes = [...new Set(forms.map((f) => f.length))].sort((a, b) => b - a);
  for (const size of sizes) {
    const result = placed(size);
    if (result.length) return result;
  }
  return [];
}

/**
 * Get the names of tonal's voicing templates, for the `template` option:
 * shell, guide-tones, rootless, rootless-spread, so-what, fourths,
 * upper-structure (and upper-structure-II, -bIII, -bV, -bVI, -VI) and
 * triad-over-root. Each one is in two or more jazz piano books (see the
 * README).
 *
 * @example
 * Voicing.templates().includes("rootless"); // => true
 */
export function templates(): string[] {
  return Object.keys(TEMPLATES);
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
/** @deprecated Use the options object: `Voicing.get(chord, { range, previous })`. Removed in tonal 7. */
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
 *    `top`), then the root or the 5th: every mix is tried.
 * 2. Placement: every arrangement inside the range (or the range of each
 *    voice), with neighbour voices at most an octave apart (a 10th for the
 *    lowest two), the top note and the slash bass where asked, and no
 *    interval below the low interval limits.
 * 3. Cost, lower first: the voice leading from `previous` (one per
 *    semitone); or the distance from the `anchor`; or a quarter per semitone
 *    from the centroid to the middle of the range. Twelve when the voicing
 *    carries its own bass and the chord's bass isn't at the bottom (not with
 *    an anchor). Always: one per chord step beyond close
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
/** @deprecated Use the options object: `Voicing.search(chord, { range })`. Removed in tonal 7. */
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
 * Get a voicing for each chord of a list: the smoothest path through the
 * voicings `Voicing.search` gives for each chord, so that the voices move as
 * little as possible over the whole progression (an exact path, not a
 * greedy one). The options are the ones of `Voicing.get`, for every chord, and
 * each chord can be an object with its own (`{ chord: "G7", voices: 5 }`), all
 * but `previous` and `metric`, which belong to the whole sequence. `maxLeap`
 * limits the move of each voice. A chord without voicings gives `[]`, and the
 * next one is led from the last. The defaults play each chord's own notes,
 * close, with no bass part or tensions: to play a chart, pass `{ voices: 4,
 * extensions: "available", bass: "root" }` (`voices + 1` notes, the bass
 * first), or `bass: "external"` with a bass player.
 *
 * Each step costs the voice-leading distance from the voicing before (see
 * `VoiceLeading.path`) plus the voicing's own cost in `Voicing.search`
 * (register, spacing), so the progression doesn't drift away from the range.
 * With the bass in the voicing (`bass: "none"`), every chord prefers root
 * position, since the lowest note is heard as the bass; for triads that invert
 * over a root, use `{ bass: "root", voices: 3 }`.
 *
 * The defaults play each chord's own notes, close and in the middle, with no
 * bass part or tensions. To play a chart as a pianist, pass `{ voices: 4,
 * extensions: "available", bass: "root" }`: a bass part (the chord's bass, in
 * `bassRange`) under four voices with the tensions that suit each chord, so
 * each voicing has `voices + 1` notes. With a bass player, use
 * `bass: "external"`, which leaves the bass note out.
 *
 * (Called with a range array as the second argument, it uses the old
 * dictionary voicings, which are deprecated: see the README.)
 *
 * Sources: Dmitri Tymoczko, *A Geometry of Music* (2011), §2.8: efficient
 * voice leading as a short path between chords; see `Voicing.search` and
 * `VoiceLeading.path` for the rest.
 *
 * @param chords - chord symbols, or objects with a chord and its own options
 * @param options - the options of `Voicing.get` for every chord, plus `maxLeap`
 * @example
 * Voicing.sequence(["C", "Am", "F", "G"]); // => [["C4", "E4", "G4"], ["A3", "C4", "E4"], ["F3", "A3", "C4"], ["G3", "B3", "D4"]]
 * Voicing.sequence(["Cmaj7", "Am7", "Dm7", "G7"], { voices: 4, extensions: "available", bass: "root" }); // => [["C3", "G3", "B3", "D4", "E4"], ["A2", "G3", "B3", "C4", "E4"], ["D2", "F3", "A3", "C4", "E4"], ["G2", "F3", "A3", "B3", "E4"]]
 * Voicing.sequence(["Dm7", "G7", "Cmaj7"], { voices: 4, extensions: "available", bass: "external" }); // => [["F3", "A3", "C4", "E4"], ["F3", "A3", "B3", "E4"], ["E3", "G3", "B3", "D4"]]
 * Voicing.sequence(["Dm7", { chord: "G7", voices: 5 }, "Cmaj7"], { voices: 4 }).map((v) => v.length); // => [4, 5, 4]
 */
export function sequence(
  chords: (string | VoicingChord)[],
  options?: SequenceOptions,
): string[][];
/** @deprecated Use the options object: `Voicing.sequence(chords, { range, previous })`. Removed in tonal 7. */
export function sequence(
  chords: string[],
  range?: string[],
  dictionary?: VoicingDictionary,
  voiceLeading?: VoiceLeadingFunction,
  lastVoicing?: string[],
): string[][];
export function sequence(
  chords: (string | VoicingChord)[],
  options?: SequenceOptions | string[],
  ...legacy: unknown[]
): string[][] {
  if (Array.isArray(options) || legacy.length > 0) {
    return legacySequence(
      chords as string[],
      (options as string[]) ?? defaultRange,
      (legacy[0] as VoicingDictionary) ?? defaultDictionary,
      (legacy[1] as VoiceLeadingFunction) ?? defaultVoiceLeading,
      legacy[2] as string[] | undefined,
    );
  }
  return sequenceVoicings(chords, options);
}

function legacySequence(
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
