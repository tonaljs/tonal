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
//    Only rounded percentages are used here, never the transcriptions:
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
// 5. Skips (a ghost eighth before a new chord) are added to the line.
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
  /** Walking in four, two-feel, or the head in two and the solos walking */
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
  /** The share of approach notes played with a skip (0 to 1) */
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
  skips: 0.15,
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

// two-feel in the head (the first and last chorus), except in a bridge
function isTwoFeel(feel: Feel, bar: Chart.PlayedBar, choruses: number) {
  if (feel === "walk") return false;
  if (feel === "two") return true;
  const head = bar.chorus === 1 || bar.chorus === choruses;
  const bridge = /^(b|bridge)$/i.test(bar.section);
  return head && !bridge;
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
      isTwoFeel(options.feel, bar, options.choruses) &&
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
 * on-beat notes; the 3rd, 5th and 7th are the chord's own, whatever their
 * alteration; "tension" is any other note of the chord's scale).
 */
const KINDS: Record<Place, Record<Kind, number>> = {
  // the first beat of a chord: R 69, 5 11, 3 5 (+b3 3), 7 3; a chromatic
  // note is rare (the b3 counted there is mostly a minor chord's 3rd)
  onset: {
    root: 0.7,
    fifth: 0.11,
    third: 0.07,
    seventh: 0.03,
    tension: 0.05,
    chromatic: 0.015,
  },
  // the last beat before a new chord: R 19, 3 18, 5 15, b5 12, 7 12, 9 5
  last: {
    root: 0.18,
    third: 0.2,
    fifth: 0.15,
    seventh: 0.12,
    tension: 0.13,
    chromatic: 0.22,
  },
  // a chord held from the bar before
  beat1: {
    root: 0.45,
    fifth: 0.15,
    third: 0.15,
    seventh: 0.07,
    tension: 0.1,
    chromatic: 0.08,
  },
  // beat 2: 5 16, 3 15 (+b3 7), 9 13, R 11, b7 8, 7 7, b5 7, b9 6
  beat2: {
    root: 0.11,
    third: 0.21,
    fifth: 0.16,
    seventh: 0.15,
    tension: 0.2,
    chromatic: 0.17,
  },
  // beat 3 in a one-chord bar: 5, 3 and 13 lead; the root less than the
  // corpus's 36%, which counts bars with two chords
  beat3: {
    root: 0.15,
    fifth: 0.17,
    third: 0.17,
    seventh: 0.08,
    tension: 0.24,
    chromatic: 0.12,
  },
  beat4: {
    root: 0.15,
    third: 0.2,
    fifth: 0.15,
    seventh: 0.12,
    tension: 0.18,
    chromatic: 0.2,
  },
  // beat 3 in two-feel: a chord tone
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
 * up and down. The octave takes a good part of the 8-12.
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
                : size === 12
                  ? 0.03
                  : size < 12
                    ? 0.043 / 4
                    : 0.004;
  return size === 0 ? both : both / 2;
}

/**
 * How often each interval leads into a new chord, signed (FiloBass, 13,704
 * chord changes): from a half step below 27.4%, a half step above 21.6%, a
 * whole step above 12.1%, a fourth below 10.5%, the same note 5.3%, a fifth
 * above 4.4%, a whole step below 4.1%; everything else about 1% or less.
 */
const INTO: Record<number, number> = {
  1: 0.274,
  [-1]: 0.216,
  [-2]: 0.121,
  5: 0.105,
  0: 0.053,
  [-7]: 0.044,
  2: 0.041,
  [-3]: 0.019,
  3: 0.017,
  6: 0.015,
  4: 0.013,
  [-4]: 0.012,
  [-6]: 0.011,
  7: 0.011,
  [-5]: 0.008,
  12: 0.005,
  [-12]: 0.005,
};
const intoWeight = (semitones: number) => INTO[semitones] ?? 0.002;

/**
 * Keeping a direction, inside a chord and into a new one: a move in the same
 * direction as the one before is this much more likely than turning. Real
 * lines keep going inside a chord (FiloBass one-chord bars: up-up-up 21%,
 * down-down-down 17%) and often turn at the change, where the approach table
 * takes over.
 */
const KEEP_DIRECTION = { inChord: 2.0, intoChord: 0.8 };

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
  /** A leap of a tritone or more into a note outside the chord */
  leapIntoNonChord: 0.15,
  /** A leap of a fourth or more between two chord tones: more likely */
  chordToneLeap: 1.3,
  /** A leap into a new chord from a note reached by a leap */
  leapAfterLeap: 0.15,
};

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
      ((KINDS[slot.place][kind] * chromatic) / sameKind) *
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
        const e = emission(slot, state.midi) ** power;
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

  const steps = describe(slots, chosen, info);
  const notes = withSkips(steps, slots, options, random(options.seed + 1));
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
    return { slot: i, note, role, why };
  });
}

// an approach in walking (or the last half in two-feel) can be played with a
// skip: the note, then the same note as a ghost on the swung eighth before
// the next chord
function withSkips(
  steps: Step[],
  slots: Slot[],
  options: BassOptions,
  rnd: () => number,
): BassNote[] {
  const notes: BassNote[] = [];
  for (const step of steps) {
    const slot = slots[step.slot];
    const base = {
      note: step.note,
      role: step.role,
      chord: slot.chord,
      why: step.why,
      bar: slot.bar,
    };
    const skip =
      slot.place === "last" &&
      !!slots[step.slot + 1]?.chord &&
      rnd() < options.skips;
    if (!skip) {
      notes.push({
        ...base,
        start: Time.fraction(slot.start)!,
        duration: Time.fraction(slot.duration)!,
      });
      continue;
    }
    const first = slot.duration - 0.5;
    notes.push({
      ...base,
      start: Time.fraction(slot.start)!,
      duration: Time.fraction(first)!,
    });
    notes.push({
      ...base,
      role: "ghost",
      why: "a skip: the note again, as a ghost note, on the eighth before the next chord",
      start: Time.fraction(slot.start + first)!,
      duration: Time.fraction(0.5)!,
    });
  }
  return notes;
}
