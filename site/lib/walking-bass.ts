// A walking bass line over a chord chart. The generator lives in the app:
// tonal gives the pieces (the played form and its chords, the chord's scale
// in a key, what a note is over a chord, approach notes), and this file puts
// them together with its own rules.
//
// How a line is made:
//
// 1. The chart is played (`Chart.unroll`, `Chart.chords`) and cut into slots:
//    quarter notes when walking, half notes in two-feel. `N.C.` is a rest.
// 2. Every pitch in the range is a candidate on every slot. How likely each
//    one is comes from a few tables, set from what real bass lines do: our
//    own counts of FiloBass, a corpus of 48 transcribed jazz walking lines
//    (Jasper Riley and Simon Dixon, "FiloBass: A Dataset and Corpus Based
//    Study of Jazz Basslines", ISMIR 2023, https://aim-qmul.github.io/FiloBass).
//    Only rounded percentages are used here, never the transcriptions; the
//    shapes of a bar (SHAPES) are set by hand and only checked against it:
//    - what the note is over the chord (root, 3rd, 5th, 7th, a tension of the
//      chord's scale, or chromatic), by where the slot is: the first beat of a
//      chord, the last beat before a new one, or a beat in between;
//    - the interval from the note before, and a separate table for the
//      interval into a new chord (from a half step below 27%, a half step
//      above 22%, a whole step above 12%, a fourth below 10%...);
//    - the register, around F2.
// 3. A whole line is drawn from those probabilities (forward filtering,
//    backward sampling, as a hidden Markov model generates): every line is
//    different, typical lines are more likely, and a seed gives the same line
//    again. The lowest-cost line would be a stepwise crawl; real lines leap a
//    fourth or more 30% of the time.
// 4. tonal names what was drawn: `Chord.classify` says what each note is over
//    its chord, `Scale.approaches` which kind of approach leads into the next
//    chord, and the chord and its scale spell the notes.
// 5. Notes between the beats are added to the line: eighths and triplets in
//    walking, the rhythms of two-feel (see BETWEEN, EXTRA and TWO_FEEL).
import { Chart, Chord, Note, Scale, Time } from "tonal";

/** What a note does in the line. */
export type Role =
  "root" | "chord tone" | "scale tone" | "passing" | "approach" | "ghost";

/** A note of the line, in the shape of a tonal event. */
export type BassNote = {
  /** Where it starts, in quarter notes from the start of the played form */
  start: Time.Fraction;
  /** How long it lasts, in quarter notes */
  duration: Time.Fraction;
  /** The note, with octave (sounding pitch) */
  note: string;
  role: Role;
  /** The chord symbol it's played over */
  chord: string;
  /** Why this note, in words */
  why: string;
  /** Its bar in the played form, from 0 */
  bar: number;
};

export type Feel = "walk" | "two" | "head";

export type BassOptions = {
  /** A key or scale name, like "F major" */
  key: string;
  choruses: number;
  /** Walking in four, two-feel, or the first chorus in two and then walking */
  feel: Feel;
  /** The lowest and highest notes (sounding) */
  range: [string, string];
  seed: number;
  /** How far from the most typical line (0 to 2) */
  variety: number;
  /** How willing to use chromatic notes (0 to 2) */
  chromatic: number;
  /** How willing to leap a fourth or more (0 to 2) */
  leaps: number;
  /**
   * How many notes between the beats: 1 is as many as real players (0 to 2);
   * 0.4 by default, which sounds less busy
   */
  skips: number;
};

export const DEFAULT_OPTIONS: BassOptions = {
  key: "F major",
  choruses: 2,
  feel: "head",
  range: ["E1", "G3"],
  seed: 1,
  variety: 1,
  chromatic: 1,
  leaps: 1,
  skips: 0.4,
};

// --- the slots -------------------------------------------------------------

/** Where a slot is in its chord, for the tables below. */
type Place = "onset" | "last" | "beat1" | "beat2" | "beat3" | "beat4" | "two";

/** A place for a note: a quarter (walking) or a half note (two-feel). */
type Slot = {
  start: number;
  duration: number;
  /** The chord symbol, or "" for a rest (N.C.) */
  chord: string;
  bar: number;
  /** The beat in the bar, from 0 */
  beat: number;
  /** The first slot of a chord */
  onset: boolean;
  two: boolean;
  place: Place;
};

const num = (value: Time.TimeValue) => Time.toNumber(value) ?? 0;

// two-feel in the head (the first chorus), except in a bridge, then walking:
// FiloBass players play 37% of their bars in two-feel in the first tenth of a
// track, 12% in the second, and 1-3% after that (10% in the last tenth: most
// heads out are walked)
function isTwoFeel(feel: Feel, bar: Chart.PlayedBar) {
  if (feel === "walk") return false;
  if (feel === "two") return true;
  const bridge = /^(b|bridge)$/i.test(bar.section);
  return bar.chorus === 1 && !bridge;
}

function slotsOf(text: string, options: BassOptions) {
  const chart = Chart.parse(text);
  const played = Chart.unroll(chart, { choruses: options.choruses });
  const chords = Chart.chords(chart, { choruses: options.choruses });
  const starts = new Set(chords.map((c) => num(c.start)));
  const slots: Slot[] = [];
  for (const bar of played) {
    const start = num(bar.start);
    const length = num(bar.duration);
    // halves only when every chord of the bar starts on beat 1 or 3
    const changes = [...starts].filter((s) => s > start && s < start + length);
    const two =
      isTwoFeel(options.feel, bar) &&
      length % 2 === 0 &&
      changes.every((s) => (s - start) % 2 === 0);
    const step = two ? 2 : 1;
    for (let beat = 0; beat + step <= length; beat += step) {
      const at = start + beat;
      const chord = Chart.chordAt(chords, at);
      const previous = slots[slots.length - 1];
      // a rest (N.C.), or a symbol tonal can't read
      const value =
        chord && !chord.rest && Chord.get(chord.value).tonic ? chord.value : "";
      slots.push({
        start: at,
        duration: step,
        chord: value,
        bar: bar.index,
        beat,
        onset: starts.has(at) || !previous || previous.chord !== value,
        two,
        place: "beat1",
      });
    }
  }
  // where each slot is in its chord
  slots.forEach((slot, i) => {
    const next = slots[i + 1];
    const lastOfChord = !!next && next.chord !== "" && next.onset;
    slot.place = slot.onset
      ? "onset"
      : lastOfChord
        ? "last"
        : slot.two
          ? "two"
          : (["beat1", "beat2", "beat3", "beat4"] as const)[
              Math.min(slot.beat, 3)
            ];
  });
  return { chart, slots };
}

// --- the tables --------------------------------------------------------------

/** What a note is over a chord, as the tables count it. */
type Kind = "root" | "third" | "fifth" | "seventh" | "tension" | "chromatic";

/**
 * How often each kind of note is played, by place in the chord (FiloBass,
 * the bars walked in quarters; the 3rd, 5th and 7th are the chord's own,
 * whatever their alteration; "tension" is any other note of the chord's
 * scale).
 */
const KINDS: Record<Place, Record<Kind, number>> = {
  // the first beat of a chord: R 69, 5 12, 3 8, 7 3, a tension 6, chromatic 3
  onset: {
    root: 0.685,
    third: 0.076,
    fifth: 0.119,
    seventh: 0.025,
    tension: 0.063,
    chromatic: 0.031,
  },
  // the last beat before a new chord: anything, chromatic 22%
  last: {
    root: 0.172,
    third: 0.154,
    fifth: 0.149,
    seventh: 0.076,
    tension: 0.225,
    chromatic: 0.224,
  },
  // a chord held from the bar before (FiloBass changes chord every bar: set
  // by hand, between the first beat and beat 3)
  beat1: {
    root: 0.45,
    third: 0.15,
    fifth: 0.15,
    seventh: 0.07,
    tension: 0.1,
    chromatic: 0.08,
  },
  // beat 2, where the line moves: tensions 31%, chromatic 17%
  beat2: {
    root: 0.08,
    third: 0.173,
    fifth: 0.156,
    seventh: 0.11,
    tension: 0.308,
    chromatic: 0.173,
  },
  // beat 3 inside a chord
  beat3: {
    root: 0.217,
    third: 0.193,
    fifth: 0.175,
    seventh: 0.074,
    tension: 0.233,
    chromatic: 0.107,
  },
  // beat 4 inside a chord that goes on (rare: set like the last beat)
  beat4: {
    root: 0.172,
    third: 0.154,
    fifth: 0.149,
    seventh: 0.076,
    tension: 0.225,
    chromatic: 0.224,
  },
  // beat 3 in two-feel: a chord tone (set by hand)
  two: {
    root: 0.3,
    fifth: 0.35,
    third: 0.15,
    seventh: 0.08,
    tension: 0.08,
    chromatic: 0.04,
  },
};

/**
 * How often each interval is played, in semitones (FiloBass: 0 7.4%, 1 30%,
 * 2 17%, 3-4 14.5%, 5 10%, 6-7 12.4%, 8-12 7.3%, more 1.2%), shared between
 * up and down. Of the leaps of 8-12, a minor sixth is the most common (a
 * sixth down to a chord tone), then the octave.
 */
function intervalWeight(semitones: number) {
  const size = Math.abs(semitones);
  const both =
    size === 0
      ? 0.074
      : size === 1
        ? 0.3
        : size === 2
          ? 0.17
          : size <= 4
            ? 0.145 / 2
            : size === 5
              ? 0.1
              : size <= 7
                ? 0.124 / 2
                : size === 8
                  ? 0.03
                  : size === 12
                    ? 0.022
                    : size < 12
                      ? 0.02 / 3
                      : 0.0005;
  const fit = FIT.interval[intervalClass(size)] ?? 1;
  return (size === 0 ? both : both / 2) * fit;
}

// Corrections to the tables, fitted with the walking bass harness in the
// research repo (assist-tonal, spikes/walking-bass-eval/fit.py), which
// rewrites the block between the markers. The tables measure things that
// overlap (most scale tones are a step away), so multiplying them gives too
// many steps and too few leaps; each factor is the ratio of the corpus share
// to the generated one, applied until they agree.
// fit:start
const FIT: {
  interval: Record<string, number>;
  kinds: Record<string, Record<string, number>>;
} = {
  interval: {
    "0": 0.469,
    "1": 0.716,
    "2": 0.741,
    "3-4": 1.581,
    "5": 0.927,
    "6-7": 2.485,
    "8-12": 1.679,
  },
  kinds: {
    onset: {
      root: 0.868,
      third: 1.511,
      fifth: 1.378,
      seventh: 1.184,
      tension: 1.439,
      chromatic: 2.299,
    },
    last: {
      root: 1.732,
      third: 0.789,
      fifth: 0.736,
      seventh: 0.912,
      tension: 0.922,
      chromatic: 1.163,
    },
    beat2: {
      root: 2.801,
      third: 0.841,
      fifth: 0.762,
      seventh: 0.278,
      tension: 1.252,
      chromatic: 3.222,
    },
    beat3: {
      root: 1.752,
      third: 0.762,
      fifth: 0.697,
      seventh: 1.315,
      tension: 1.0,
      chromatic: 1.765,
    },
  },
};
// fit:end

/** The class of an interval size, as the corpus counts are grouped. */
function intervalClass(size: number) {
  return size <= 2
    ? `${size}`
    : size <= 4
      ? "3-4"
      : size === 5
        ? "5"
        : size <= 7
          ? "6-7"
          : size <= 12
            ? "8-12"
            : ">12";
}

/**
 * How often each interval leads into a new chord, signed (FiloBass, the bars
 * walked in quarters): from a half step below 31%, a half step above 26%, a
 * whole step above 13.5%, a fourth below 8.4%, a whole step below 4.3%, a
 * fifth above 4.2%; the same note only 1%.
 */
const INTO: Record<number, number> = {
  1: 0.312,
  [-1]: 0.258,
  [-2]: 0.135,
  5: 0.084,
  2: 0.043,
  [-7]: 0.042,
  [-3]: 0.018,
  3: 0.016,
  4: 0.013,
  [-6]: 0.012,
  0: 0.01,
  6: 0.01,
  7: 0.008,
  [-5]: 0.008,
  [-4]: 0.008,
};
const intoWeight = (semitones: number) => INTO[semitones] ?? 0.002;

/**
 * Keeping a direction, inside a chord and into a new one: a move in the same
 * direction as the one before is this much more likely than turning. Real
 * lines keep going inside a chord (FiloBass one-chord bars: up-up-up 21%,
 * down-down-down 17%) and often turn at the change, where the approach table
 * takes over.
 */
const KEEP_DIRECTION = { inChord: 1.75, intoChord: 0.8 };

/** A repeated note inside a chord, less likely than the interval table says. */
const REPEAT_IN_CHORD = 0.5;

/**
 * How a note that isn't in the chord is led, as bass methods teach it: how
 * much less likely each move is than the tables above say.
 */
const RULES = {
  /** A chromatic note left by a whole step (a half step is best) */
  chromaticWholeStep: 0.6,
  /** A chromatic note left by a leap: it doesn't resolve */
  chromaticLeap: 0.03,
  /** A scale tone outside the chord, reached by a leap and left by a leap */
  betweenLeaps: 0.1,
  /** A leap of a tritone or more into a note outside the chord (players do
   * it, about a quarter of their big leaps, then resolve it by step) */
  leapIntoNonChord: 0.7,
  /** A leap of a fourth or more between two chord tones: more likely */
  chordToneLeap: 1.3,
  /** A leap into a new chord from a note reached by a leap */
  leapAfterLeap: 0.15,
};

/**
 * The shape of a one-chord bar before a new chord, as bass methods teach it:
 * start on the root and lead to the next chord's root. Set by hand, and
 * checked against real lines with the walking bass harness (assist-tonal,
 * spikes/walking-bass-eval):
 *
 * - a chromatic climb: the three notes before the new chord rise by half
 *   steps to a half step below its root (before a chord a fourth up this is
 *   R-9-b3-3, before a fifth up R-3-11-b5);
 * - a chromatic descent: the same from above (before a fifth up, R-b7-13-b13);
 * - a climb from the fifth: the chromatic climb, starting on the fifth
 *   (before the same root, 5-13-b7-7);
 * - an arpeggio up (R-3-5) or down (R-5-3), and a scale run up or down in the
 *   chord's scale (R-9-3, R-b7-13), the last beat left to the approach;
 * - free: the note-by-note tables decide.
 *
 * A chromatic line goes on in the direction it leaves the root in: a climb
 * starts above the root, a descent below it, a third away at most. So they
 * depend on how the root moves, as in real lines (no climb into the same
 * root, or into a chord a half step down).
 */
type Shape =
  | "chromatic climb"
  | "climb from the fifth"
  | "chromatic descent"
  | "arpeggio up"
  | "arpeggio down"
  | "scale up"
  | "scale down"
  | "free";
const SHAPES: Record<Shape, number> = {
  "chromatic climb": 0.16,
  "climb from the fifth": 0.05,
  "chromatic descent": 0.07,
  "arpeggio up": 0.08,
  "arpeggio down": 0.05,
  "scale up": 0.07,
  "scale down": 0.1,
  free: 0.47,
};

// the pitch class of each note of a shape (undefined: free), or undefined if
// the shape doesn't fit the bar
function shapePcs(
  shape: Shape,
  symbol: string,
  nextSymbol: string,
  scale: string,
): (number | undefined)[] | undefined {
  const bass = Chord.bass(symbol);
  const start = Note.chroma(bass);
  const target = Note.chroma(Chord.bass(nextSymbol));
  if (start === undefined || target === undefined) return undefined;
  const pc = (n: number) => ((n % 12) + 12) % 12;
  // the first note of a line is up (or down) from the root by a third at most
  const above = (a: number, b: number) => pc(b - a) >= 1 && pc(b - a) <= 4;
  const below = (a: number, b: number) => pc(a - b) >= 1 && pc(a - b) <= 4;
  const degree = (...ds: string[]) => {
    const formula = Chord.formula(symbol);
    const d = ds.find((x) => formula.includes(x));
    return d ? Note.chroma(Chord.noteOf(symbol, d)) : undefined;
  };
  const step = (n: number) =>
    Note.chroma(Scale.transposeBySteps(scale, Note.pitchClass(bass), n));
  switch (shape) {
    case "chromatic climb": {
      const line = [pc(target - 3), pc(target - 2), pc(target - 1)];
      return above(start, line[0]) ? [start, ...line] : undefined;
    }
    case "climb from the fifth": {
      const fifth = degree("5", "b5", "#5");
      const line = [pc(target - 3), pc(target - 2), pc(target - 1)];
      return fifth !== undefined && above(fifth, line[0])
        ? [fifth, ...line]
        : undefined;
    }
    case "chromatic descent": {
      const line = [pc(target + 3), pc(target + 2), pc(target + 1)];
      return below(start, line[0]) ? [start, ...line] : undefined;
    }
    case "arpeggio up":
    case "arpeggio down": {
      const third = degree("3", "b3", "4");
      const fifth = degree("5", "b5", "#5");
      if (third === undefined || fifth === undefined) return undefined;
      return shape === "arpeggio up"
        ? [start, third, fifth, undefined]
        : [start, fifth, third, undefined];
    }
    case "scale up":
    case "scale down": {
      const dir = shape === "scale up" ? 1 : -1;
      const a = step(dir);
      const b = step(2 * dir);
      return a === undefined || b === undefined
        ? undefined
        : [start, a, b, undefined];
    }
    default:
      return undefined;
  }
}

/** The register: around F2 (MIDI 41), most notes within an octave of it. */
const REGISTER = { centre: 41, spread: 14 };

// --- what tonal says about each chord ---------------------------------------

type ChordInfo = {
  symbol: string;
  /** The chord's scale in the key, like "G mixolydian" */
  scale: string;
  /** The kind of each pitch class (chroma 0-11) over the chord */
  kinds: Kind[];
  /** The class tonal gives each pitch class (Chord.classify) */
  classes: string[];
  /** How to spell each pitch class: the chord's notes, then its scale's */
  names: string[];
};

const CHROMAS = [
  "C",
  "Db",
  "D",
  "Eb",
  "E",
  "F",
  "Gb",
  "G",
  "Ab",
  "A",
  "Bb",
  "B",
];

function chordInfo(symbol: string, key: string): ChordInfo {
  const scale =
    Chord.chordScale(symbol, { key }) || Chord.chordScale(symbol) || "";
  const chord = Chord.get(symbol);
  const root = Note.chroma(Chord.bass(symbol)) ?? 0;
  const formula = Chord.formula(symbol);
  const pcOf = (...degrees: string[]) =>
    degrees
      .filter((d) => formula.includes(d))
      .map((d) => Note.chroma(Chord.noteOf(symbol, d)));
  const third = pcOf("3", "b3", "4", "2");
  const fifth = pcOf("5", "b5", "#5");
  const seventh = pcOf("7", "b7", "bb7", "6");
  const classes = CHROMAS.map((pc) => Chord.classify(symbol, pc, { key }));
  const kinds = CHROMAS.map((_, pc): Kind => {
    if (pc === root) return "root";
    if (third.includes(pc)) return "third";
    if (fifth.includes(pc)) return "fifth";
    if (seventh.includes(pc)) return "seventh";
    const c = classes[pc];
    return c === "tension" || c === "chord tone" ? "tension" : "chromatic";
  });
  // the scale's spelling, then the chord's (which wins)
  const names = CHROMAS.map(() => "");
  for (const n of [...Scale.get(scale).notes, ...chord.notes]) {
    const pc = Note.chroma(n);
    if (pc !== undefined) names[pc] = Note.pitchClass(n);
  }
  return { symbol, scale, kinds, classes, names };
}

// --- the sampler -------------------------------------------------------------

/** A seeded random number generator (mulberry32). */
export function random(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// draw an index with probability proportional to its weight
function draw(weights: number[], rnd: () => number) {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = rnd() * total;
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i];
    if (r <= 0) return i;
  }
  return weights.length - 1;
}

export type BassLine = {
  notes: BassNote[];
  /** The chords of the played form, for the labels */
  chords: { value: string; start: number; duration: number }[];
  /** The scale and kinds of each chord symbol */
  info: Record<string, ChordInfo>;
  problems: string[];
  /** The length of the played form, in quarter notes */
  length: number;
};

/** Make a walking bass line over a chart. */
export function walkingBass(text: string, options: BassOptions): BassLine {
  const { chart, slots } = slotsOf(text, options);
  const rnd = random(options.seed);
  const low = Note.midi(options.range[0]) ?? 28;
  const high = Note.midi(options.range[1]) ?? 55;
  const pitches = Array.from({ length: high - low + 1 }, (_, i) => low + i);
  // variety is a temperature: 0 the most typical lines, 2 the least
  const power = 1 / (0.4 + 0.6 * options.variety);

  const info: Record<string, ChordInfo> = {};
  for (const slot of slots) {
    if (slot.chord && !info[slot.chord]) {
      info[slot.chord] = chordInfo(slot.chord, options.key);
    }
  }

  // how likely a pitch is on a slot, on its own
  const emission = (slot: Slot, midi: number) => {
    const chord = info[slot.chord];
    const kind = chord.kinds[midi % 12];
    const sameKind = chord.kinds.filter((k) => k === kind).length;
    const chromatic = kind === "chromatic" ? options.chromatic + 0.02 : 1;
    const z = (midi - REGISTER.centre) / REGISTER.spread;
    return (
      ((KINDS[slot.place][kind] *
        (FIT.kinds[slot.place]?.[kind] ?? 1) *
        chromatic) /
        sameKind) *
      Math.exp(-0.5 * z * z)
    );
  };
  // how likely a move is, from a pitch to one on the next slot; `turn` is the
  // direction of the move into the pitch before (-1, 0 or 1)
  const kindOf = (slot: Slot, midi: number) =>
    info[slot.chord].kinds[midi % 12];

  // how likely a move is, from a state on a slot to a pitch on the next one
  const transition = (fromSlot: Slot, from: State, to: Slot, midi: number) => {
    const d = midi - from.midi;
    const size = Math.abs(d);
    const leap = size >= 5 ? options.leaps + 0.02 : 1;
    const keep =
      from.dir !== 0 && Math.sign(d) === from.dir
        ? to.onset
          ? KEEP_DIRECTION.intoChord
          : KEEP_DIRECTION.inChord
        : 1;
    const repeat = d === 0 && !to.onset ? REPEAT_IN_CHORD : 1;
    const base = to.onset ? intoWeight(d) : intervalWeight(d);
    return base * leap * keep * repeat * voiceLeading(fromSlot, from, to, midi);
  };

  // what a bass player doesn't do with a note that isn't in the chord
  const voiceLeading = (
    fromSlot: Slot,
    from: State,
    to: Slot,
    midi: number,
  ) => {
    const size = Math.abs(midi - from.midi);
    const before = kindOf(fromSlot, from.midi);
    const after = kindOf(to, midi);
    let weight = 1;
    // 1. a chromatic note moves on by step, best by a half step
    if (before === "chromatic") {
      weight *=
        size === 1
          ? 1
          : size === 2
            ? RULES.chromaticWholeStep
            : RULES.chromaticLeap;
    }
    // 2. a scale tone that isn't in the chord isn't between two leaps
    if (before === "tension" && from.leap && size >= 3) {
      weight *= RULES.betweenLeaps;
    }
    // 3. no big leap into a note that isn't in the chord
    if (size >= 6 && (after === "chromatic" || after === "tension")) {
      weight *= RULES.leapIntoNonChord;
    }
    // 5. leaps are between chord tones: an arpeggio, an octave drop
    const chordTone = (k: Kind) => k !== "tension" && k !== "chromatic";
    if (size >= 5 && chordTone(before) && chordTone(after)) {
      weight *= RULES.chordToneLeap;
    }
    // 4. into a new chord, not a leap after a leap: an approach from the
    //    fifth (a fourth below, a fifth above) is reached by step or a third
    if (to.onset && fromSlot.place === "last" && from.leap && size >= 5) {
      weight *= RULES.leapAfterLeap;
    }
    return weight;
  };

  // the states of the lattice: a pitch, the direction it was reached in, and
  // whether it was reached by a leap (a minor third or more)
  type State = { midi: number; dir: number; leap: boolean };
  const states: State[] = pitches.flatMap((midi) =>
    [-1, 0, 1].flatMap((dir) =>
      [false, true].map((leap) => ({ midi, dir, leap })),
    ),
  );
  const reaches = (from: State, to: State) => {
    const d = to.midi - from.midi;
    return Math.sign(d) === to.dir && Math.abs(d) >= 3 === to.leap;
  };

  // a shape for each one-chord bar walked in quarters before a new chord:
  // the pitch class of each of its notes, or none (free)
  const shapeRnd = random(options.seed + 2);
  const figureOf = new Map<
    number,
    { pc: number; shape: Shape; next: string }
  >();
  slots.forEach((slot, i) => {
    if (slot.beat !== 0 || !slot.chord || slot.two) return;
    const bar = slots.slice(i, i + 4);
    const next = slots[i + 4];
    if (
      bar.length !== 4 ||
      !bar.every(
        (s) => s.chord === slot.chord && s.bar === slot.bar && !s.two,
      ) ||
      !next?.chord ||
      !next.onset
    ) {
      return;
    }
    const scale = info[slot.chord].scale;
    const options_ = (Object.keys(SHAPES) as Shape[])
      .map((shape) => ({
        shape,
        pcs:
          shape === "free"
            ? []
            : shapePcs(shape, slot.chord, next.chord, scale),
      }))
      .filter((o) => o.pcs !== undefined);
    let r = shapeRnd() * options_.reduce((a, o) => a + SHAPES[o.shape], 0);
    const chosen = options_.find((o) => (r -= SHAPES[o.shape]) <= 0);
    if (!chosen || chosen.shape === "free") return;
    chosen.pcs!.forEach((pc, k) => {
      if (pc !== undefined) {
        figureOf.set(i + k, { pc, shape: chosen.shape, next: next.chord });
      }
    });
  });
  const allowed = (index: number, midi: number) => {
    const f = figureOf.get(index);
    return !f || f.pc === midi % 12 ? 1 : 0;
  };

  // the slots with notes, in runs between rests
  const runs: number[][] = [];
  slots.forEach((slot, i) => {
    if (!slot.chord) return;
    const last = runs[runs.length - 1];
    if (last && last[last.length - 1] === i - 1) last.push(i);
    else runs.push([i]);
  });

  const chosen = new Map<number, number>();
  for (const run of runs) {
    // forward: how likely each state is on each slot, given the slots before
    const forward: number[][] = [];
    run.forEach((index, k) => {
      const slot = slots[index];
      const fromSlot = slots[run[k - 1]];
      const row = states.map((state) => {
        const e =
          (emission(slot, state.midi) * allowed(index, state.midi)) ** power;
        if (k === 0) return state.dir === 0 && !state.leap ? e : 0;
        const before = forward[k - 1];
        let sum = 0;
        for (let q = 0; q < states.length; q++) {
          if (before[q] > 0 && reaches(states[q], state)) {
            sum +=
              before[q] *
              transition(fromSlot, states[q], slot, state.midi) ** power;
          }
        }
        return e * sum;
      });
      const total = row.reduce((a, b) => a + b, 0) || 1;
      forward.push(row.map((v) => v / total));
    });
    // backward: draw the last state, then each one before given the next
    let s = draw(forward[forward.length - 1], rnd);
    chosen.set(run[run.length - 1], states[s].midi);
    for (let k = run.length - 2; k >= 0; k--) {
      const slot = slots[run[k]];
      const next = slots[run[k + 1]];
      const to = states[s];
      const weights = forward[k].map((f, q) => {
        if (f === 0 || !reaches(states[q], to)) return 0;
        return f * transition(slot, states[q], next, to.midi) ** power;
      });
      s = draw(weights, rnd);
      chosen.set(run[k], states[s].midi);
    }
  }

  const steps = describe(slots, chosen, info, figureOf);
  const notes = withRhythm(
    steps,
    slots,
    info,
    options,
    random(options.seed + 1),
  );
  const chords = Chart.chords(chart, { choruses: options.choruses }).map(
    (c) => ({ value: c.value, start: num(c.start), duration: num(c.duration) }),
  );
  const last = slots[slots.length - 1];
  return {
    notes,
    chords,
    info,
    problems: chart.problems,
    length: last ? last.start + last.duration : 0,
  };
}

// --- naming what was drawn ---------------------------------------------------

type Step = { slot: number; note: string; role: Role; why: string };

const APPROACH_WORDS: [keyof Scale.ApproachNotes, string][] = [
  ["below", "a half step below"],
  ["above", "a half step above"],
  ["scaleAbove", "the scale note above"],
  ["scaleBelow", "the scale note below"],
  ["dominantBelow", "its fifth, a fourth below"],
  ["dominantAbove", "its fifth, a fifth above"],
];

// the name of a pitch over a chord, spelled by the chord or its scale, or by
// the direction it moves in when it's chromatic
function spell(midi: number, chord: ChordInfo, rising: boolean) {
  const pc = chord.names[midi % 12];
  if (pc) {
    const octave = Math.floor(midi / 12) - 1;
    for (const oct of [octave, octave - 1, octave + 1]) {
      if (Note.midi(pc + oct) === midi) return pc + oct;
    }
  }
  return rising ? Note.fromMidiSharps(midi) : Note.fromMidi(midi);
}

function describe(
  slots: Slot[],
  chosen: Map<number, number>,
  info: Record<string, ChordInfo>,
  figureOf: Map<number, { shape: Shape; next: string }>,
): Step[] {
  const indexes = [...chosen.keys()].sort((a, b) => a - b);
  const names = new Map<number, string>();
  for (const i of indexes) {
    const midi = chosen.get(i)!;
    const before = chosen.get(i - 1);
    const rising = before === undefined || midi > before;
    names.set(i, spell(midi, info[slots[i].chord], rising));
  }
  return indexes.map((i) => {
    const slot = slots[i];
    const chord = info[slot.chord];
    const midi = chosen.get(i)!;
    let note = names.get(i)!;
    const pc = midi % 12;
    const degree = Chord.degreeOf(slot.chord, note);
    let role: Role =
      chord.kinds[pc] === "root"
        ? "root"
        : chord.classes[pc] === "chord tone"
          ? "chord tone"
          : chord.classes[pc] === "tension"
            ? "scale tone"
            : "passing";
    let why =
      role === "root"
        ? `the root of ${slot.chord}`
        : role === "chord tone"
          ? `chord tone: the ${degree} of ${slot.chord}`
          : role === "scale tone"
            ? `scale tone: the ${degree}, in ${chord.scale}`
            : `chromatic: the ${degree}, outside ${chord.scale}`;
    // the note before a new chord: which approach to the target it is
    const next = slots[i + 1];
    const target = names.get(i + 1);
    if (slot.place === "last" && next && target) {
      const approaches = Scale.approaches(info[next.chord].scale, target);
      const found = APPROACH_WORDS.find(
        ([kind]) => Note.midi(approaches[kind] as string) === midi,
      );
      if (found) {
        note = approaches[found[0]] as string;
        role = "approach";
        why = `approach to ${target} (${next.chord}): ${found[1]}`;
      } else if (midi === Note.midi(target)) {
        why += `, the same note as the next chord's first`;
      }
    }
    const figure = figureOf.get(i);
    if (figure) {
      why += `; part of ${figure.shape === "free" ? "" : `a ${figure.shape}`} leading to ${figure.next}`;
    }
    return { slot: i, note, role, why };
  });
}

// --- the notes between the beats ----------------------------------------------

/**
 * How often a walking bar has a note between the beats, after each beat
 * (FiloBass: 29% of walking bars, a little more after beats 1 and 4); 82%
 * are a swung eighth, 16% a triplet (two notes). Checked with the harness.
 */
const BETWEEN = {
  afterBeat: [0.087, 0.058, 0.064, 0.085],
  triplet: 0.16,
};

/**
 * What the note between the beats is (FiloBass): the next note early 20%, an
 * open string dropped as a ghost and back up 19% (D2 70% of them, A1 15%), the
 * note before again 15%, a half step into the next 10%, a whole step into the
 * next 9%, the octave of the note before 3%.
 */
type Extra = "anticipate" | "drop" | "repeat" | "half" | "whole" | "octave";
const EXTRA: Record<Extra, number> = {
  anticipate: 0.15,
  drop: 0.19,
  repeat: 0.09,
  half: 0.08,
  whole: 0.09,
  octave: 0.03,
};
// with two notes between the beats, the first fills and the last leads in
const FILL: Partial<Record<Extra, number>> = {
  repeat: 0.25,
  drop: 0.6,
  octave: 0.15,
};
const LEAD: Partial<Record<Extra, number>> = {
  anticipate: 0.3,
  half: 0.35,
  whole: 0.35,
};

/**
 * The rhythms of a two-feel bar, as positions in quarter notes (FiloBass, 851
 * bars): the two half notes alone are only 22%; a quarter on beat 4, an eighth
 * after beat 2 or 4, or both, make the rest.
 */
const TWO_FEEL: [number[], number][] = [
  [[0, 2], 0.22],
  [[0, 2, 3], 0.14],
  [[0, 1.5, 2, 3.5], 0.12],
  [[0, 2, 3.5], 0.107],
  [[0, 1.5, 2, 3], 0.08],
  [[0, 1.5, 2], 0.067],
  [[0, 1.5, 2, 2.5, 3], 0.067],
  [[0, 1.5, 2, 2.5], 0.036],
];

/**
 * The open strings a bass drops to as ghost notes, sounding, in order of
 * preference (FiloBass: D2 70% of the drops, A1 15%, E1 3%).
 */
const DROP_TO = ["D2", "A1", "E1"];

const pick = <T extends string>(
  weights: Partial<Record<T, number>>,
  rnd: () => number,
) => {
  const entries = Object.entries(weights) as [T, number][];
  let r = rnd() * entries.reduce((a, [, w]) => a + w, 0);
  for (const [k, w] of entries) if ((r -= w) <= 0) return k;
  return entries[entries.length - 1][0];
};

/**
 * Add the notes between the beats to a line in slots: in walking, a swung
 * eighth or a triplet after some beats; in two-feel, a rhythm from the table.
 * `amount` scales how often (1 is as often as the players).
 */
function withRhythm(
  steps: Step[],
  slots: Slot[],
  info: Record<string, ChordInfo>,
  options: BassOptions,
  rnd: () => number,
): BassNote[] {
  const [low, high] = options.range.map((n) => Note.midi(n) ?? 0);
  const amount = options.skips;
  const notes: BassNote[] = [];
  const bySlot = new Map(steps.map((s) => [s.slot, s]));

  // the note of an extra kind, between `step` and the note after it
  const extraNote = (kind: Extra, step: Step, next: Step) => {
    const midi = Note.midi(step.note) ?? 0;
    const nextMidi = Note.midi(next.note) ?? 0;
    const scale = info[slots[next.slot].chord]?.scale ?? "";
    const a = Scale.approaches(scale, next.note);
    const fromBelow = midi < nextMidi;
    switch (kind) {
      case "anticipate":
        return {
          note: next.note,
          role: "approach" as Role,
          why: `${next.note} early, on the eighth before it`,
        };
      case "repeat":
        return {
          note: step.note,
          role: "ghost" as Role,
          why: "the note again, as a ghost note",
        };
      case "drop": {
        // D2 first, then A1 and E1, at least a minor third below
        const open = DROP_TO.find((s) => {
          const m = Note.midi(s) ?? 0;
          return m <= midi - 3 && m >= low;
        });
        return open
          ? {
              note: open,
              role: "ghost" as Role,
              why: `an open string (${open}) dropped as a ghost note`,
            }
          : undefined;
      }
      case "half": {
        const note = fromBelow ? a.below : a.above;
        return note
          ? {
              note,
              role: "approach" as Role,
              why: `a half step into ${next.note}`,
            }
          : undefined;
      }
      case "whole": {
        const note = fromBelow ? a.scaleBelow : a.scaleAbove;
        return note
          ? {
              note,
              role: "approach" as Role,
              why: `the scale step into ${next.note}`,
            }
          : undefined;
      }
      case "octave": {
        const down = Note.transpose(step.note, "-8P");
        const up = Note.transpose(step.note, "8P");
        const note =
          (Note.midi(down) ?? 0) >= low
            ? down
            : (Note.midi(up) ?? 0) <= high
              ? up
              : "";
        return note
          ? { note, role: step.role, why: "the note before, an octave away" }
          : undefined;
      }
    }
  };

  for (const step of steps) {
    const slot = slots[step.slot];
    const next = bySlot.get(step.slot + 1);
    const base = { role: step.role, chord: slot.chord, bar: slot.bar };
    // where the extra notes go, as offsets from the slot's start: exact
    // fractions, since a triplet is a third of a beat
    let extras: Time.Fraction[] = [];
    if (next && !slot.two && slot.duration === 1) {
      const rate = BETWEEN.afterBeat[Math.min(slot.beat, 3)] * amount;
      if (rnd() < rate) {
        const triplet: Time.Fraction[] = [
          [1, 3],
          [2, 3],
        ];
        extras = rnd() < BETWEEN.triplet ? triplet : [[1, 2]];
      }
    } else if (next && slot.two) {
      // the bar's rhythm is drawn on its first half, and kept for the second
      const shape = shapeOf(slot, slots, step.slot, amount, rnd);
      extras = shape
        .filter((p) => p > slot.beat && p < slot.beat + 2)
        .map((p) => Time.fraction(p - slot.beat)!);
    }
    const slotStart = Time.fraction(slot.start)!;
    const ends: Time.Fraction[] = [...extras, Time.fraction(slot.duration)!];
    notes.push({
      ...base,
      note: step.note,
      why: step.why,
      start: slotStart,
      duration: ends[0],
    });
    let previous = step;
    extras.forEach((offset, k) => {
      const last = k === extras.length - 1;
      const weights = extras.length === 1 ? EXTRA : last ? LEAD : FILL;
      let made: ReturnType<typeof extraNote>;
      for (let tries = 0; tries < 4 && !made; tries++)
        made = extraNote(pick(weights, rnd), previous, next!);
      made ??= {
        note: next!.note,
        role: "approach",
        why: `${next!.note} early, on the eighth before it`,
      };
      notes.push({
        ...base,
        ...made,
        start: Time.add(slotStart, offset)!,
        duration: Time.sub(ends[k + 1], offset)!,
      });
      previous = { ...step, note: made.note };
    });
  }
  return notes;
}

// the rhythm of a two-feel bar: one per bar, drawn once (cached on the bar)
const shapes = new WeakMap<Slot, number[]>();
function shapeOf(
  slot: Slot,
  slots: Slot[],
  index: number,
  amount: number,
  rnd: () => number,
) {
  const first = slot.beat === 0 ? slot : slots[index - 1];
  let shape = shapes.get(first);
  if (!shape) {
    const weights = TWO_FEEL.map(([s, w]) => (s.length === 2 ? w : w * amount));
    let r = rnd() * weights.reduce((a, b) => a + b, 0);
    shape = TWO_FEEL.find((_, k) => (r -= weights[k]) <= 0)?.[0] ?? [0, 2];
    shapes.set(first, shape);
  }
  return shape;
}
