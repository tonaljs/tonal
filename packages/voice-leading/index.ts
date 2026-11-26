import {
  chroma as noteChroma,
  get as noteGet,
  midi as noteMidi,
} from "@tonaljs/note";

/**
 * How the size of a voice leading adds up the motion of its voices:
 *
 * - `"L1"`: the sum of the semitones each voice moves (taxicab)
 * - `"L2"`: the square root of the sum of their squares (Euclidean)
 * - `"Linf"`: the largest move of any voice
 */
export type VoiceLeadingMetric = "L1" | "L2" | "Linf";

export type VoiceLeadingOptions = {
  /** How to add up the motion of the voices. Default `"L1"`. */
  metric?: VoiceLeadingMetric;
};

/** A voice moving from one note to another. */
export type VoiceLeadingMove = [from: string, to: string];

/** The smallest voice leading between two voicings: its size and its moves. */
export type VoiceLeadingMapping = {
  /** The size of the voice leading, or `null` if it can't be computed. */
  distance: number | null;
  /** The move of each voice, from the lowest voice of the first voicing up. */
  moves: VoiceLeadingMove[];
};

export type VoiceLeadingPathOptions = VoiceLeadingOptions & {
  /** The voicing before the first chord, if any. */
  previous?: string[];
  /**
   * The largest move of a voice, in semitones. A candidate that needs a larger
   * move from every voicing the path can be at in the chord before is skipped,
   * unless every candidate of its chord does (then none is skipped).
   */
  maxLeap?: number;
  /**
   * The cost of each candidate itself, added to the voice-leading cost. Same
   * shape as the candidates. Default 0.
   */
  costs?: number[][];
};

/** The smoothest path through the candidates of a list of chords. */
export type VoiceLeadingPath = {
  /** One voicing per chord, `[]` for a chord without candidates. */
  voicings: string[][];
  /** The total cost of the path. */
  cost: number;
  /** The cost added at each chord: the voice leading into it plus its own. */
  steps: number[];
};

// A note of a voicing with its midi number
type Pitch = { note: string; midi: number };

function size(moves: number[], metric: VoiceLeadingMetric = "L1"): number {
  if (metric === "Linf") return moves.reduce((m, d) => Math.max(m, d), 0);
  if (metric === "L2") return Math.sqrt(moves.reduce((s, d) => s + d * d, 0));
  return moves.reduce((s, d) => s + d, 0);
}

// Every way to add `extra` notes to a list by repeating its own notes. Each
// result is the list plus the repeated notes, by index, without duplicates.
function doublings<T>(items: T[], extra: number): T[][] {
  const result: T[][] = [];
  const add = (start: number, left: number, chosen: T[]) => {
    if (left === 0) {
      result.push([...items, ...chosen]);
      return;
    }
    for (let i = start; i < items.length; i++) {
      add(i, left - 1, [...chosen, items[i]]);
    }
  };
  add(0, extra, []);
  return result;
}

function pitches(voicing: string[]): Pitch[] | undefined {
  if (!Array.isArray(voicing) || voicing.length === 0) return undefined;
  const list: Pitch[] = [];
  for (const note of voicing) {
    const midi = noteMidi(note);
    if (midi === null || midi === undefined) return undefined;
    list.push({ note: noteGet(note).name, midi });
  }
  return list.sort((a, b) => a.midi - b.midi);
}

const NO_MAPPING: VoiceLeadingMapping = { distance: null, moves: [] };

function mapping(
  from: Pitch[],
  to: Pitch[],
  metric?: VoiceLeadingMetric,
): VoiceLeadingMapping {
  // Doublings: the voicing with fewer notes repeats some of them, as few as
  // needed so both have the same number of voices.
  const extra = Math.abs(from.length - to.length);
  const fromSets = from.length < to.length ? doublings(from, extra) : [from];
  const toSets = to.length < from.length ? doublings(to, extra) : [to];
  let best: VoiceLeadingMapping = NO_MAPPING;
  for (const a of fromSets) {
    for (const b of toSets) {
      // Sorted matching: the lowest voice to the lowest voice, and so on
      const fa = [...a].sort((x, y) => x.midi - y.midi);
      const fb = [...b].sort((x, y) => x.midi - y.midi);
      const distance = size(
        fa.map((p, i) => Math.abs(fb[i].midi - p.midi)),
        metric,
      );
      if (best.distance === null || distance < best.distance) {
        best = {
          distance,
          moves: fa.map((p, i): VoiceLeadingMove => [p.note, fb[i].note]),
        };
      }
    }
  }
  return best;
}

/**
 * Get the smallest voice leading between two voicings (lists of notes with
 * octave): how far the voices move, and where each voice goes. It returns
 * `{ distance: null, moves: [] }` if a voicing is empty or has a note without
 * octave.
 *
 * Each voice goes to the voice in the same position counting from the bottom.
 * When one voicing has fewer notes, some of its notes are doubled, as few as
 * needed so both have the same number of voices, choosing the doublings that
 * give the smallest voice leading.
 *
 * Sources:
 *
 * - Dmitri Tymoczko, *A Geometry of Music* (2011), §2.5: a voice leading maps
 *   the notes of one chord to the notes of another, and doublings are allowed
 *   (a "non-bijective" voice leading, §4.9).
 * - *A Geometry of Music*, §4.9 and Appendix A: removing voice crossings never
 *   makes a voice leading larger, so matching the notes in order from the
 *   bottom gives the smallest one, for every reasonable way of measuring it
 *   (the sum of the moves, the Euclidean size or the largest move).
 *
 * @param from - the first voicing, like ["C4", "E4", "G4"]
 * @param to - the second voicing, like ["B3", "D4", "G4"]
 * @param options - `metric`: how to add up the moves (default `"L1"`, the sum)
 * @example
 * VoiceLeading.get(["C4", "E4", "G4"], ["B3", "D4", "G4"]); // => { distance: 3, moves: [["C4", "B3"], ["E4", "D4"], ["G4", "G4"]] }
 * VoiceLeading.get(["C4", "E4", "G4"], ["C4", "E4", "G4", "B4"]).moves; // => [["C4", "C4"], ["E4", "E4"], ["G4", "G4"], ["G4", "B4"]]
 */
export function get(
  from: string[],
  to: string[],
  options: VoiceLeadingOptions = {},
): VoiceLeadingMapping {
  const a = pitches(from);
  const b = pitches(to);
  return a && b ? mapping(a, b, options.metric) : NO_MAPPING;
}

/**
 * Get the size of the smallest voice leading between two voicings (lists of
 * notes with octave): by default, the total number of semitones the voices
 * move. It returns `null` if a voicing is empty or has a note without octave.
 * See `VoiceLeading.get` for how the voices are matched.
 *
 * Sources: Dmitri Tymoczko, *A Geometry of Music* (2011), §2.7 and Appendix A
 * (the size of a voice leading, and the sum of the moves, the Euclidean size
 * and the largest move as reasonable measures), §4.9 (the voices matched in
 * order from the bottom give the smallest voice leading).
 *
 * @param from - the first voicing, like ["C4", "E4", "G4"]
 * @param to - the second voicing, like ["B3", "D4", "G4"]
 * @param options - `metric`: `"L1"` (default, the sum of the moves), `"L2"` or `"Linf"` (the largest move)
 * @example
 * VoiceLeading.distance(["C4", "E4", "G4"], ["B3", "D4", "G4"]); // => 3
 * VoiceLeading.distance(["C4", "E4", "G4"], ["B3", "D4", "G4"], { metric: "Linf" }); // => 2
 * VoiceLeading.distance(["C4", "E4"], ["C"]); // => null
 */
export function distance(
  from: string[],
  to: string[],
  options: VoiceLeadingOptions = {},
): number | null {
  return get(from, to, options).distance;
}

// The shortest path between two pitch classes, in semitones (0 to 6)
function pcMove(a: number, b: number): number {
  const up = (((b - a) % 12) + 12) % 12;
  return Math.min(up, 12 - up);
}

function chromas(notes: string[]): number[] | undefined {
  if (!Array.isArray(notes) || notes.length === 0) return undefined;
  const set = new Set<number>();
  for (const note of notes) {
    const chroma = noteChroma(note);
    if (!Number.isFinite(chroma)) return undefined;
    set.add(chroma);
  }
  return [...set].sort((a, b) => a - b);
}

/**
 * Get the size of the smallest voice leading between two sets of pitch
 * classes, without octaves: each voice moves the shortest way to its new
 * pitch class. Notes with octave are read as their pitch class, and repeated
 * pitch classes count once. It returns `null` if a list is empty or has an
 * invalid note.
 *
 * Chords of different sizes double notes of the smaller one, as
 * `VoiceLeading.get` does. Use `Chord.notes` to compare chord symbols.
 *
 * Sources: Dmitri Tymoczko, *A Geometry of Music* (2011), §2.5 (pitch-class
 * voice leadings: each voice takes the shortest path) and §4.9 (a smallest
 * voice leading keeps the order of the notes around the octave, so only the
 * rotations of one chord against the other need to be tried); the
 * neo-Riemannian P, L and R moves, which have size 1, 1 and 2 (§4.9).
 *
 * @param from - pitch classes or notes, like ["C", "E", "G"]
 * @param to - pitch classes or notes, like ["A", "C", "E"]
 * @param options - `metric`: `"L1"` (default, the sum of the moves), `"L2"` or `"Linf"`
 * @example
 * VoiceLeading.pcDistance(["C", "E", "G"], ["C", "E", "A"]); // => 2
 * VoiceLeading.pcDistance(Chord.notes("C"), Chord.notes("Em")); // => 1
 * VoiceLeading.pcDistance(Chord.notes("Dm7"), Chord.notes("G7")); // => 3
 */
export function pcDistance(
  from: string[],
  to: string[],
  options: VoiceLeadingOptions = {},
): number | null {
  const a = chromas(from);
  const b = chromas(to);
  if (!a || !b) return null;
  const extra = Math.abs(a.length - b.length);
  const aSets = a.length < b.length ? doublings(a, extra) : [a];
  const bSets = b.length < a.length ? doublings(b, extra) : [b];
  let best: number | null = null;
  for (const x of aSets) {
    const sa = [...x].sort((p, q) => p - q);
    for (const y of bSets) {
      const sb = [...y].sort((p, q) => p - q);
      // every rotation of one chord against the other
      for (let r = 0; r < sb.length; r++) {
        const moves = sa.map((pc, i) => pcMove(pc, sb[(i + r) % sb.length]));
        const d = size(moves, options.metric);
        if (best === null || d < best) best = d;
      }
    }
  }
  return best;
}

type Node = { voicing: string[]; pitches: Pitch[]; own: number };
type Step = { cost: number; back: number; added: number };

/**
 * Get the smoothest path through the candidate voicings of a list of chords:
 * one voicing per chord, so that the total voice-leading distance between
 * consecutive voicings (plus the cost of each candidate, if given) is the
 * smallest possible. It returns `[]` for a chord without valid candidates and
 * leads the next chord from the last voicing.
 *
 * The path is exact (dynamic programming), not greedy: an early choice that
 * forces large moves later is avoided. On a tie, the first candidate in the
 * list wins, so the order of the candidates is a preference.
 *
 * Sources: Dmitri Tymoczko, *A Geometry of Music* (2011), §2.8: efficient
 * voice leading is a short path between chords, and its size is the distance
 * of `VoiceLeading.distance`. The path is found with the Viterbi algorithm
 * (Andrew Viterbi, "Error bounds for convolutional codes and an asymptotically
 * optimum decoding algorithm", 1967).
 *
 * @param candidates - for each chord, its candidate voicings
 * @param options - `metric`, `previous` (the voicing before the first chord), `maxLeap` (the largest move of a voice, in semitones) and `costs` (the cost of each candidate)
 * @example
 * VoiceLeading.path([[["C4", "E4", "G4"]], [["F4", "A4", "C5"], ["C4", "F4", "A4"]], [["G4", "B4", "D5"], ["B3", "D4", "G4"]]]).voicings; // => [["C4", "E4", "G4"], ["C4", "F4", "A4"], ["B3", "D4", "G4"]]
 * VoiceLeading.path([[["C4", "E4", "G4"]], [["F4", "A4", "C5"], ["C4", "F4", "A4"]], [["G4", "B4", "D5"], ["B3", "D4", "G4"]]]).steps; // => [0, 3, 6]
 */
export function path(
  candidates: string[][][],
  options: VoiceLeadingPathOptions = {},
): VoiceLeadingPath {
  const { metric, maxLeap, costs = [] } = options;
  const previous = options.previous && pitches(options.previous);
  const layers: Node[][] = (Array.isArray(candidates) ? candidates : []).map(
    (list, chord) =>
      (Array.isArray(list) ? list : []).flatMap((voicing, i): Node[] => {
        const p = pitches(voicing);
        const own = costs[chord]?.[i] ?? 0;
        return p ? [{ voicing, pitches: p, own: Number(own) || 0 }] : [];
      }),
  );

  const edge = (a: Pitch[], b: Pitch[]) => {
    const m = mapping(a, b, metric);
    const leap = m.moves.reduce(
      (max, [x, y]) => Math.max(max, Math.abs(noteMidi(y)! - noteMidi(x)!)),
      0,
    );
    return { cost: m.distance ?? 0, leap };
  };

  // steps[c][i]: the best path that ends at candidate i of chord c
  const steps: Step[][] = [];
  let last = -1; // the last chord with candidates
  layers.forEach((nodes, c) => {
    if (nodes.length === 0) {
      steps.push([]);
      return;
    }
    const from: Pitch[][] =
      last === -1
        ? previous
          ? [previous]
          : []
        : layers[last].map((n) => n.pitches);
    const base: number[] =
      last === -1 ? (previous ? [0] : []) : steps[last].map((s) => s.cost);
    const edges = nodes.map((n) => from.map((f) => edge(f, n.pitches)));
    const limit =
      maxLeap !== undefined &&
      edges.some((row) =>
        // from a candidate that the path can be at (not a skipped one)
        row.some((e, j) => e.leap <= maxLeap && base[j] < Infinity),
      )
        ? maxLeap
        : Infinity;
    steps.push(
      nodes.map((node, i) => {
        if (from.length === 0)
          return { cost: node.own, back: -1, added: node.own };
        let best: Step | undefined;
        edges[i].forEach((e, j) => {
          if (e.leap > limit) return;
          const added = e.cost + node.own;
          const cost = base[j] + added;
          if (!best || cost < best.cost) best = { cost, back: j, added };
        });
        return best ?? { cost: Infinity, back: -1, added: Infinity };
      }),
    );
    last = c;
  });

  const voicings: string[][] = layers.map(() => []);
  const added: number[] = layers.map(() => 0);
  if (last === -1) return { voicings, cost: 0, steps: added };
  let index = steps[last].reduce(
    (best, s, i) => (s.cost < steps[last][best].cost ? i : best),
    0,
  );
  const cost = steps[last][index].cost;
  for (let c = last; c >= 0 && index >= 0; c--) {
    if (layers[c].length === 0) continue;
    voicings[c] = [...layers[c][index].voicing];
    added[c] = steps[c][index].added;
    index = steps[c][index].back;
  }
  return { voicings, cost, steps: added };
}

/**
 * A function that decides which of a set of voicings is picked as a follow up
 * to lastVoicing.
 *
 * @deprecated Used by the deprecated positional forms of `Voicing.get` and
 * `Voicing.sequence`. Removed in tonal 7.
 */
export declare type VoiceLeadingFunction = (
  voicings: string[][],
  lastVoicing: string[],
) => string[];

/**
 * Pick the voicing whose top note is closest to the top note of the last
 * voicing (the first of them on a tie). If there is no last voicing, it picks
 * the first one. It returns `[]` if there are no voicings, and doesn't change
 * the given list.
 *
 * @param voicings - candidate voicings, like [["C4", "E4", "G4"], ["E4", "G4", "C5"]]
 * @param lastVoicing - the previous voicing
 * @deprecated It only looks at the top note: use `VoiceLeading.path`, or
 * `Voicing.get` with `previous`, which measure every voice. Removed in tonal 7.
 * @example
 * VoiceLeading.topNoteDiff([["C4", "E4", "G4"], ["E4", "G4", "C5"], ["G4", "C5", "E5"]], ["D4", "F4", "A4"]); // => ["C4", "E4", "G4"]
 */
export const topNoteDiff: VoiceLeadingFunction = (voicings, lastVoicing) => {
  if (!Array.isArray(voicings) || !voicings.length) return [];
  if (!Array.isArray(lastVoicing) || !lastVoicing.length) {
    return voicings[0];
  }
  const topNoteMidi = (voicing: string[]) =>
    noteMidi(voicing[voicing.length - 1]) || 0;
  const diff = (voicing: string[]) =>
    Math.abs(topNoteMidi(lastVoicing) - topNoteMidi(voicing));
  // the first voicing with the smallest difference, without sorting the list
  return voicings.reduce((best, voicing) =>
    diff(voicing) < diff(best) ? voicing : best,
  );
};

/** @deprecated Use the named exports instead. */
export default {
  topNoteDiff,
};
