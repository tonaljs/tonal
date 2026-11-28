import { chroma as noteChroma, get as getNote } from "@tonaljs/note";
import { hasSpacing, stepsOf, VoicingSpacing } from "./spacing";
import {
  distance as voiceLeadingDistance,
  VoiceLeadingMetric,
} from "@tonaljs/voice-leading";

export type NoteRange = [low: string, high: string];
export type AnchorMode = "below" | "above" | "duck" | "root";

type Pitch = { name: string; midi: number; chroma: number; degree: string };

/**
 * The lowest acceptable note of the lower voice of each interval, in midi,
 * by the size of the interval in semitones (from a minor 2nd to a major 10th).
 * Unisons, octaves and intervals wider than a 10th have no limit.
 *
 * Source: Gary Lindsay, *Jazz Arranging Techniques* (2005), ch. 12, "Low
 * Interval Limits Chart", p. 94. The interval is measured from the root of the
 * chord (or an "imaginary root" below the lowest note, when the root isn't in
 * the bass) to the next note up (p. 93).
 *
 * @private
 */
export const LOW_INTERVAL_LIMITS: Record<number, number> = {
  1: 52, // m2: E3-F3
  2: 51, // M2: Eb3-F3
  3: 48, // m3: C3-Eb3
  4: 46, // M3: Bb2-D3
  5: 46, // P4: Bb2-Eb3
  6: 46, // A4: Bb2-E3
  7: 34, // P5: Bb1-F2
  8: 43, // m6: G2-Eb3
  9: 41, // M6: F2-D3
  10: 41, // m7: F2-Eb3
  11: 41, // M7: F2-E3
  13: 40, // m9: E2-F3
  14: 39, // M9: Eb2-F3
  15: 36, // m10: C2-Eb3
  16: 34, // M10: Bb1-D3
};

/** @private */
export function passesLowIntervalLimits(
  midis: number[],
  rootChroma: number,
): boolean {
  if (midis.length < 2) return true;
  const lowest = midis[0];
  // the root, or the imaginary root below the lowest note
  const isRoot = ((lowest % 12) + 12) % 12 === rootChroma;
  const root = isRoot
    ? lowest
    : lowest - ((((lowest - rootChroma) % 12) + 12) % 12 || 12);
  const upper = isRoot ? midis[1] : lowest;
  const limit = LOW_INTERVAL_LIMITS[upper - root];
  return limit === undefined || root >= limit;
}

/** The constraints and the context of a placement. @private */
export type PlaceOptions = {
  range: NoteRange;
  ranges?: NoteRange[];
  top?: string | NoteRange;
  bass?: "none" | "root" | "external";
  bassRange: NoteRange;
  bassNote?: string; // pitch class of the chord's bass
  rootChroma: number;
  family: string;
  /** The guide tones of the chord: its 3rd (or 4th) and 7th (or 6th). */
  guides: string[];
  lowIntervals: boolean;
  previous?: string[];
  metric?: VoiceLeadingMetric;
  anchor?: string;
  mode?: AnchorMode;
  /** A named spacing or the chord steps between neighbour voices. */
  spacing?: VoicingSpacing;
  /** Check the gaps between neighbour voices. Default true. */
  gaps?: boolean;
};

const midiOf = (note: string) => getNote(note).midi ?? NaN;

// Every note of a pitch class inside a midi range, spelled as the pitch class
function notesIn(pc: string, low: number, high: number): string[] {
  const result: string[] = [];
  for (let oct = -1; oct <= 9; oct++) {
    const note = getNote(pc + oct);
    if (
      !note.empty &&
      note.midi !== null &&
      note.midi >= low &&
      note.midi <= high
    ) {
      result.push(note.name);
    }
  }
  return result;
}

/**
 * Every arrangement of the tones (one note per voice, distinct pitches,
 * sorted from the bottom) that passes the constraints.
 *
 * @private
 */
export function arrangements(
  notes: string[],
  degrees: string[],
  options: PlaceOptions,
): Pitch[][] {
  const ranges = options.ranges;
  const low = midiOf(ranges ? ranges[0][0] : options.range[0]);
  const high = midiOf(ranges ? ranges[ranges.length - 1][1] : options.range[1]);
  if (!Number.isFinite(low) || !Number.isFinite(high)) return [];
  const choices = notes.map((pc, i) =>
    notesIn(pc, low, high).map((name): Pitch => ({
      name,
      midi: midiOf(name),
      chroma: noteChroma(name) as number,
      degree: degrees[i],
    })),
  );
  const seen = new Set<string>();
  const result: Pitch[][] = [];
  const walk = (i: number, chosen: Pitch[]) => {
    if (i === choices.length) {
      const sorted = [...chosen].sort((a, b) => a.midi - b.midi);
      const key = sorted.map((p) => p.midi + p.degree).join(" ");
      if (!seen.has(key) && fits(sorted, options)) {
        seen.add(key);
        result.push(sorted);
      }
      return;
    }
    for (const p of choices[i]) {
      if (chosen.some((c) => c.midi === p.midi)) continue;
      walk(i + 1, [...chosen, p]);
    }
  };
  walk(0, []);
  return result;
}

/** Does an arrangement pass the constraints? @private */
export function fits(voicing: Pitch[], options: PlaceOptions): boolean {
  const midis = voicing.map((p) => p.midi);
  if (
    options.spacing &&
    !hasSpacing(midis, options.spacing, options.rootChroma)
  ) {
    return false;
  }
  // a range for each voice
  if (options.ranges) {
    if (options.ranges.length !== voicing.length) return false;
    const ok = options.ranges.every(([lo, hi], i) => {
      return midis[i] >= midiOf(lo) && midis[i] <= midiOf(hi);
    });
    if (!ok) return false;
  }
  // the top note: an exact note or a range
  const top = voicing[voicing.length - 1];
  if (typeof options.top === "string") {
    const t = getNote(options.top);
    if (top.midi !== t.midi || top.chroma !== t.chroma) return false;
  } else if (Array.isArray(options.top)) {
    if (top.midi < midiOf(options.top[0]) || top.midi > midiOf(options.top[1]))
      return false;
  }
  // a voicing that carries its own bass has the chord's bass at the bottom
  // when it's a slash chord
  if (
    options.bass === "none" &&
    options.bassNote &&
    noteChroma(options.bassNote) !== options.rootChroma &&
    voicing[0].chroma !== noteChroma(options.bassNote)
  ) {
    return false;
  }
  // gaps: neighbour voices at most an octave apart, the lowest two at most a
  // major 10th (Gary Lindsay, Jazz Arranging Techniques, ch. 16)
  if (options.gaps !== false) {
    for (let i = 1; i < midis.length; i++) {
      const gap = midis[i] - midis[i - 1];
      if (gap > (i === 1 ? 16 : 12)) return false;
    }
  }

  if (
    options.lowIntervals &&
    options.bass !== "root" &&
    !passesLowIntervalLimits(midis, options.rootChroma)
  ) {
    return false;
  }
  return true;
}

/** A voicing with its notes, ready to rank. @private */
export type Candidate = { notes: string[]; pitches: Pitch[]; bass?: Pitch };

/** Add the bass part under each arrangement. @private */
export function withBass(upper: Pitch[][], options: PlaceOptions): Candidate[] {
  if (options.bass !== "root" || !options.bassNote) {
    return upper.map((pitches) => ({
      notes: pitches.map((p) => p.name),
      pitches,
    }));
  }
  const low = midiOf(options.bassRange[0]);
  const high = midiOf(options.bassRange[1]);
  const basses = notesIn(options.bassNote, low, high).map((name): Pitch => ({
    name,
    midi: midiOf(name),
    chroma: noteChroma(name) as number,
    degree: "bass",
  }));
  // the bass part plays the chord's bass (E of C/E), so the low intervals
  // are counted from it, as from a root
  const bassChroma = noteChroma(options.bassNote) as number;
  return upper.flatMap((pitches) =>
    basses
      .filter((b) => b.midi < pitches[0].midi)
      .filter(
        (b) =>
          !options.lowIntervals ||
          passesLowIntervalLimits(
            [b.midi, ...pitches.map((p) => p.midi)],
            bassChroma,
          ),
      )
      .map((b) => ({
        notes: [b.name, ...pitches.map((p) => p.name)],
        pitches,
        bass: b,
      })),
  );
}

const EXTENSION_NUMS = [2, 4, 6, 9, 11, 13];
const degreeNum = (degree: string) => +(degree.match(/\d+$/)?.[0] ?? NaN);

/**
 * The weight of each term of the cost of a voicing. The context (the voice
 * leading from `previous`, or the distance from `anchor`) weighs 1 per
 * semitone.
 *
 * @private
 */
export const WEIGHTS = {
  /** Per semitone from the voicing's centroid to the middle of the range */
  register: 0.25,
  /** When the voicing carries its own bass and the chord's bass isn't at the bottom (not with an anchor) */
  inversion: 12,
  /** Per chord step beyond close position between neighbour voices */
  spacing: 1,
  /** Per minor 9th between two notes (except the root under a b9) */
  minorNinth: 3,
  /** When the root is played elsewhere and the lowest voice isn't a guide tone */
  guideBottom: 6,
  /** Per tension right below a chord tone more than a whole step away */
  extensionBelow: 2,
};

/** The terms of the cost of a voicing, before the weights. @private */
export type CostTerms = { context: number } & Record<
  keyof typeof WEIGHTS,
  number
>;

/** The unweighted terms of the cost of a candidate. @private */
export function costTerms(
  candidate: Candidate,
  options: PlaceOptions,
): CostTerms {
  const { pitches } = candidate;
  const midis = pitches.map((p) => p.midi);
  const all = candidate.bass ? [candidate.bass.midi, ...midis] : midis;
  const terms: CostTerms = {
    context: 0,
    register: 0,
    inversion: 0,
    spacing: 0,
    minorNinth: 0,
    guideBottom: 0,
    extensionBelow: 0,
  };

  if (options.previous && options.previous.length) {
    // voice leading from the previous voicing
    terms.context =
      voiceLeadingDistance(options.previous, candidate.notes, {
        metric: options.metric,
      }) ?? 0;
  } else if (options.anchor) {
    const anchor = midiOf(options.anchor);
    const mode = options.mode ?? "below";
    const ref =
      mode === "below" || mode === "duck" ? midis[midis.length - 1] : midis[0];
    terms.context = Math.abs(ref - anchor);
  } else {
    // register: the centroid near the centre of the range
    const low = midiOf(
      options.ranges ? options.ranges[0][0] : options.range[0],
    );
    const high = midiOf(
      options.ranges
        ? options.ranges[options.ranges.length - 1][1]
        : options.range[1],
    );
    const centroid = midis.reduce((s, m) => s + m, 0) / midis.length;
    terms.register = Math.abs(centroid - (low + high) / 2);
  }
  // A voicing that carries its own bass is heard from its lowest note: it
  // prefers the chord's bass there (C E A alone sounds like Am/C), with or
  // without a previous voicing. An anchor places the voicing freely.
  if (
    !options.anchor &&
    options.bass === "none" &&
    options.bassNote !== undefined &&
    pitches[0].chroma !== noteChroma(options.bassNote)
  ) {
    terms.inversion = 1;
  }

  // spacing: chord steps beyond close position between neighbours
  for (const step of stepsOf(midis)) terms.spacing += Math.max(0, step - 1);
  // minor 9ths between any two notes, except the root under a b9 on a dominant
  for (let i = 0; i < all.length; i++) {
    for (let j = i + 1; j < all.length; j++) {
      if (all[j] - all[i] !== 13) continue;
      const rootUnderB9 =
        (options.family === "dominant" || options.family === "altered") &&
        ((all[i] % 12) + 12) % 12 === options.rootChroma;
      if (!rootUnderB9) terms.minorNinth++;
    }
  }
  // When the root is played elsewhere, the lowest voice is a guide tone: the
  // 3rd or the 7th (the A and B forms of rootless voicings)
  if (options.bass !== "none" && !options.guides.includes(pitches[0].degree)) {
    terms.guideBottom = 1;
  }
  // an extension right below a chord tone more than a whole step away
  for (let i = 0; i < pitches.length - 1; i++) {
    const isExtension = EXTENSION_NUMS.includes(degreeNum(pitches[i].degree));
    const nextIsTone = !EXTENSION_NUMS.includes(
      degreeNum(pitches[i + 1].degree),
    );
    if (isExtension && nextIsTone && midis[i + 1] - midis[i] > 2) {
      terms.extensionBelow++;
    }
  }
  return terms;
}

/**
 * The cost of a candidate: lower is better. Every term is documented in the
 * README (`Voicing.search`).
 *
 * @private
 */
export function cost(
  candidate: Candidate,
  options: PlaceOptions,
  weights: typeof WEIGHTS = WEIGHTS,
): number {
  const terms = costTerms(candidate, options);
  return (
    terms.context +
    (Object.keys(weights) as (keyof typeof WEIGHTS)[]).reduce(
      (sum, key) => sum + weights[key] * terms[key],
      0,
    )
  );
}

/** The hard filter of each anchor mode. @private */
export function passesAnchor(candidate: Candidate, options: PlaceOptions) {
  if (!options.anchor || (options.previous && options.previous.length))
    return true;
  const anchor = getNote(options.anchor);
  if (anchor.midi === null) return true;
  const midis = candidate.pitches.map((p) => p.midi);
  const top = midis[midis.length - 1];
  const bottom = midis[0];
  switch (options.mode ?? "below") {
    case "below":
      return top <= anchor.midi;
    case "duck":
      return top < anchor.midi && !midis.includes(anchor.midi);
    case "above":
      return bottom >= anchor.midi;
    case "root":
      return (
        bottom >= anchor.midi &&
        candidate.pitches[0].chroma === options.rootChroma
      );
  }
  return true;
}
